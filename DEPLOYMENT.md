# Backend Deployment to Azure Container Apps

## Overview
This document outlines the deployment process for the backend application to Azure Container Apps with focus on environment configuration, secrets management, and CI/CD pipeline setup.

## Prerequisites
- Azure subscription with existing Container Apps Environment
- Azure Container Registry (ACR) already created
- Azure Key Vault already created
- Managed identity `team4-dev-backend-identity` with appropriate RBAC roles
- GitHub repository with secrets configured for ACR

## Application Changes Made

### 1. Dockerfile Optimization
**File**: `Dockerfile`

The Dockerfile has been updated to use a multi-stage build process:
- **Builder stage**: Compiles TypeScript to JavaScript using `npm run build`
- **Runtime stage**: Uses only production dependencies for smaller image size
- **Healthcheck**: Includes automated health verification every 30 seconds
- **Port**: Exposes port 8080
- **Entry point**: Runs compiled `dist/index.js` instead of TypeScript runtime

**Benefits**:
- Smaller production images (no development dependencies)
- Faster startup times
- Automated health monitoring
- Production-optimized builds

### 2. Application Port Configuration
**File**: `src/index.ts`

- Changed from `API_PORT` to `PORT` environment variable
- Default value: `8080` (matches Container Apps expectation)
- Allows override via environment variable

```typescript
const port = process.env.PORT || "8080";
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
```

### 3. CORS Configuration Update
**File**: `src/index.ts`

- CORS origin now respects `NODE_ENV`
- Production: Uses `FRONTEND_URL` environment variable (for internal Container Apps networking)
- Development: Uses `localhost:3000`

```typescript
const corsOrigin =
  process.env.NODE_ENV === "production"
    ? process.env.FRONTEND_URL || "http://localhost:3000"
    : "http://localhost:3000";
```

### 4. Health Check Endpoint
**File**: `src/index.ts`

Added a public health endpoint for Container Apps monitoring:

```typescript
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});
```

This endpoint is used by:
- Container Apps health probes
- Load balancing decisions
- Deployment verification

### 5. S3/AWS Configuration Update
**File**: `src/services/s3Service.ts`

Environment variables updated to match deployment specification:

| Old Variable | New Variable | Notes |
|-------------|-------------|-------|
| `AWS_REGION` | `S3_REGION` | Default: `eu-west-2` |
| `AWS_ACCESS_KEY_ID` | `S3_ACCESS_KEY_ID` | Stored in Key Vault |
| `AWS_SECRET_ACCESS_KEY` | `S3_SECRET_ACCESS_KEY` | Stored in Key Vault |
| `S3_BUCKET_NAME` | `S3_BUCKET_NAME` | Plain text env var |

### 6. Build Script
**File**: `scripts/build.mjs`

Created a simple TypeScript compilation script that:
- Runs `npx tsc` to compile TypeScript
- Outputs to `dist/` directory
- Provides clear success/failure feedback

## Environment Variables

### Required (In Key Vault)
These must be added to Azure Key Vault and referenced in Container App:

```
POSTGRES_CONNECTION_STRING
S3_ACCESS_KEY_ID
S3_SECRET_ACCESS_KEY
```

### Required (Plain Text)
```
NODE_ENV=production
PORT=8080
S3_BUCKET_NAME=<your-bucket-name>
S3_REGION=eu-west-2
```

### Optional
```
FRONTEND_URL=https://<frontend-container-app-fqdn>
```

## Secrets Configuration in Azure Key Vault

1. Navigate to your Key Vault in Azure Portal
2. Add these secrets:
   - **PostgresConnectionString**: Full PostgreSQL connection string
     ```
     postgresql://user:password@host:5432/database
     ```
   - **S3AccessKeyId**: AWS S3 access key ID
   - **S3SecretAccessKey**: AWS S3 secret access key

## GitHub Actions CI/CD Pipeline

### Existing Pipeline: `ci.yml`
- ✅ Runs on every push to `main` and pull requests
- ✅ Runs tests with coverage
- ✅ Validates code quality with Biome
- ✅ Builds the application

### New Pipeline: `build-and-push-acr.yml`
- **Trigger**: Push to `main` or manual trigger (`workflow_dispatch`)
- **Steps**:
  1. Checkout code
  2. Set up Docker Buildx for efficient multi-platform builds
  3. Login to ACR using secrets
  4. Build and push Docker image with:
     - `latest` tag
     - Git commit SHA tag (for version tracking)
     - Build cache for faster subsequent builds
  5. Log successful push

## GitHub Secrets Required

Configure these in your GitHub repository settings (`Settings` → `Secrets and variables` → `Actions`):

| Secret | Value | Example |
|--------|-------|---------|
| `ACR_LOGIN_SERVER` | ACR login server | `myacr.azurecr.io` |
| `ACR_USERNAME` | ACR admin username | (from Azure Portal) |
| `ACR_PASSWORD` | ACR admin password | (from Azure Portal) |

**Note**: Get ACR credentials from Azure Portal:
```
Your ACR → Access keys → Enable admin user → Copy login server, username, and password
```

## Deployment Steps

### Step 1: Configure GitHub Secrets
```bash
# GitHub UI: Settings → Secrets and variables → Actions
ACR_LOGIN_SERVER=<your-acr>.azurecr.io
ACR_USERNAME=<admin-username>
ACR_PASSWORD=<admin-password>
```

### Step 2: Configure Azure Key Vault Secrets
1. Open Azure Key Vault in Azure Portal
2. Add these secrets:
   - `PostgresConnectionString`
   - `S3AccessKeyId`
   - `S3SecretAccessKey`

### Step 3: Trigger Docker Image Build
Push code to `main` branch (or trigger manually):
```bash
git push origin main
```

Monitor the workflow:
- Go to GitHub → Actions tab
- Watch "Build and Push to ACR" workflow
- Confirm image is pushed successfully

### Step 4: Verify Image in ACR
```bash
# List images in ACR (requires Azure CLI)
az acr repository list --name <your-acr> --output table

# View image tags
az acr repository show --name <your-acr> --repository team4-back-app
```

### Step 5: Update Container App Environment Variables
Update the Container App with environment variables:

```bash
az containerapp update \
  --resource-group <resource-group> \
  --name team4-backend \
  --set-env-vars \
    NODE_ENV=production \
    PORT=8080 \
    S3_BUCKET_NAME=<your-bucket-name> \
    S3_REGION=eu-west-2 \
    FRONTEND_URL=https://<frontend-container-app.region.azurecontainerapps.io>
```

## Testing the Deployment

### Local Testing (Before Pushing)
```bash
# Build the application
npm run build

# Verify it runs locally
PORT=8080 NODE_ENV=production npm start

# Test the health endpoint
curl http://localhost:8080/health
```

### Docker Testing
```bash
# Build locally (matches CI/CD)
docker build -t team4-back-app:test .

# Run with environment variables
docker run -p 8080:8080 \
  -e NODE_ENV=production \
  -e PORT=8080 \
  -e S3_BUCKET_NAME=test-bucket \
  -e S3_REGION=eu-west-2 \
  -e POSTGRES_CONNECTION_STRING="postgresql://user:pass@host/db" \
  -e S3_ACCESS_KEY_ID=test-key \
  -e S3_SECRET_ACCESS_KEY=test-secret \
  team4-back-app:test

# Test the endpoint
curl http://localhost:8080/health
```

### Azure Verification
1. Navigate to Container App in Azure Portal
2. Check "Revision management" tab for deployment status
3. Check "Monitoring" → "Logs" for application output
4. Verify health checks are passing

## API Endpoints

The following endpoints are available:

### Public Endpoints
- `GET /health` - Health check probe
- `POST /api/login` - User login
- `POST /api/register` - User registration
- `GET /api/job-roles` - List all job roles
- `GET /api/job-roles/:id` - Get job role details

### Protected Endpoints (Require Authentication)
- `POST /api/job-roles` - Create job role (ADMIN only)
- `PUT /api/job-roles/:id` - Update job role (ADMIN only)
- `DELETE /api/job-roles/:id` - Delete job role (ADMIN only)
- `POST /api/apply` - Apply for a job role

## Network Configuration

### Ingress
- **Type**: Internal
- **Accessible**: Only from within Container Apps environment
- **Frontend Access**: Via internal FQDN set in `FRONTEND_URL` env var

### Port
- **Exposed**: 8080
- **Protocol**: HTTP (HTTPS handled by Container Apps platform)

## Troubleshooting

### Image Build Fails
1. Check GitHub Actions logs: `Actions` → `Build and Push to ACR` workflow
2. Verify GitHub secrets are configured correctly
3. Ensure ACR admin user is enabled

### Container Fails to Start
1. Check Container App logs in Azure Portal
2. Verify all required environment variables (Key Vault secrets) are set
3. Check Key Vault RBAC roles are assigned to `team4-dev-backend-identity`

### Health Check Fails
1. Verify `PORT=8080` environment variable is set
2. Check application logs for startup errors
3. Test health endpoint locally: `curl http://localhost:8080/health`

### Database Connection Fails
1. Verify `POSTGRES_CONNECTION_STRING` is set in Key Vault
2. Check PostgreSQL server is reachable
3. Verify credentials in connection string are correct

### S3 Upload Fails
1. Verify all three S3 secrets are in Key Vault:
   - `S3AccessKeyId`
   - `S3SecretAccessKey`
2. Check AWS S3 bucket exists and is accessible
3. Verify AWS credentials have proper permissions
4. Check `S3_BUCKET_NAME` matches your actual bucket name

## Monitoring & Logs

### Container App Logs
```bash
# View recent logs
az containerapp logs show \
  --resource-group <resource-group> \
  --name team4-backend \
  --follow

# View specific time range
az containerapp logs show \
  --resource-group <resource-group> \
  --name team4-backend \
  --tail 50
```

### Health Endpoint Monitoring
The health endpoint responds with:
```json
{ "status": "ok" }
```

Container Apps automatically:
- Probes this endpoint every 30 seconds
- Restarts the container if health check fails 3 times
- Logs health events in Application Insights

## Rollback Procedure

If deployment has issues:
1. Previous revision is automatically kept by Container Apps
2. Go to Azure Portal → Container App → "Revision management"
3. Select previous working revision
4. Click "Activate" to roll back

## Next Steps

1. ✅ Code changes applied
2. ✅ Build script created
3. ✅ Docker image optimized
4. ✅ GitHub Actions workflow created
5. ⏳ Configure GitHub secrets (ACR credentials)
6. ⏳ Configure Azure Key Vault secrets (PostgreSQL, S3)
7. ⏳ Push code to `main` branch to trigger build
8. ⏳ Verify image appears in ACR
9. ⏳ Test backend endpoints from frontend

## FAQ

**Q: What happens if I deploy without Key Vault secrets?**
A: The Container App will crash during startup. You must add all three secrets (PostgresConnectionString, S3AccessKeyId, S3SecretAccessKey) before deployment.

**Q: Can I test locally without Docker?**
A: Yes! Use `npm run dev` for development with `tsx` or `npm start` after `npm run build` for production simulation.

**Q: Do I need to restart the container when changing environment variables?**
A: The Container App will automatically restart when environment variable secrets are updated.

**Q: What if the frontend can't reach the backend?**
A: Set the `FRONTEND_URL` environment variable to match the frontend Container App's internal FQDN, and ensure both Container Apps are in the same environment.

---

**Last updated**: March 4, 2026
**Created by**: GitHub Copilot
