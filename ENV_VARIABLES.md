# Backend Environment Variables Template

## For Local Development (.env file)
```bash
# Application
NODE_ENV=development
PORT=8080

# Database (PostgreSQL)
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/team4_dev

# S3 / AWS
S3_REGION=eu-west-2
S3_BUCKET_NAME=your-dev-bucket-name
S3_ACCESS_KEY_ID=your-aws-access-key
S3_SECRET_ACCESS_KEY=your-aws-secret-key

# Frontend (optional for local development)
FRONTEND_URL=http://localhost:3000
```

## For Azure Container Apps Environment Variables

### Plain Text Variables
Set these directly in Container App configuration:
```
NODE_ENV=production
PORT=8080
S3_BUCKET_NAME=your-production-bucket-name
S3_REGION=eu-west-2
FRONTEND_URL=https://<frontend-container-app-url>
```

### Key Vault Secret References
Set these in Container App with Key Vault secret references:
```
DATABASE_URL=@Microsoft.KeyVault(SecretUri=https://<vault-name>.vault.azure.net/secrets/PostgresConnectionString/)
S3_ACCESS_KEY_ID=@Microsoft.KeyVault(SecretUri=https://<vault-name>.vault.azure.net/secrets/S3AccessKeyId/)
S3_SECRET_ACCESS_KEY=@Microsoft.KeyVault(SecretUri=https://<vault-name>.vault.azure.net/secrets/S3SecretAccessKey/)
```

**Note**: Replace:
- `your-production-bucket-name` with your actual S3 bucket name
- `<frontend-container-app-url>` with the frontend Container App's internal FQDN
- `<vault-name>` with your Key Vault name

## Step-by-Step Setup for Azure Deployment

### 1. Create Key Vault Secrets
```bash
# Login to Azure
az login

# Set variables
VAULT_NAME="your-key-vault-name"
RESOURCE_GROUP="your-resource-group"

# Create secrets
az keyvault secret set \
  --vault-name $VAULT_NAME \
  --name PostgresConnectionString \
  --value "postgresql://user:password@host:5432/database"

az keyvault secret set \
  --vault-name $VAULT_NAME \
  --name S3AccessKeyId \
  --value "your-s3-access-key-id"

az keyvault secret set \
  --vault-name $VAULT_NAME \
  --name S3SecretAccessKey \
  --value "your-s3-secret-access-key"

# Verify secrets
az keyvault secret list --vault-name $VAULT_NAME --query "[].name"
```

### 2. Update Container App Environment Variables
```bash
# Define your values
APP_NAME="team4-backend"
RESOURCE_GROUP="your-resource-group"
VAULT_NAME="your-key-vault-name"
BUCKET_NAME="your-s3-bucket"
FRONTEND_URL="https://team4-frontend.internalapp.region.azurecontainerapps.io"

# Update environment variables
az containerapp update \
  --resource-group $RESOURCE_GROUP \
  --name $APP_NAME \
  --set-env-vars \
    NODE_ENV=production \
    PORT=8080 \
    S3_BUCKET_NAME=$BUCKET_NAME \
    S3_REGION=eu-west-2 \
    FRONTEND_URL=$FRONTEND_URL \
    DATABASE_URL="@Microsoft.KeyVault(SecretUri=https://$VAULT_NAME.vault.azure.net/secrets/PostgresConnectionString/)" \
    S3_ACCESS_KEY_ID="@Microsoft.KeyVault(SecretUri=https://$VAULT_NAME.vault.azure.net/secrets/S3AccessKeyId/)" \
    S3_SECRET_ACCESS_KEY="@Microsoft.KeyVault(SecretUri=https://$VAULT_NAME.vault.azure.net/secrets/S3SecretAccessKey/)"
```

### 3. Verify Configuration
```bash
# View current environment variables
az containerapp show \
  --resource-group $RESOURCE_GROUP \
  --name $APP_NAME \
  --query "properties.template.containers[].env"

# Check Container App status
az containerapp show \
  --resource-group $RESOURCE_GROUP \
  --name $APP_NAME \
  --query "properties.provisioningState"
```

## Testing Environment Variables Locally

Create a `.env.test` file with dummy values:
```bash
NODE_ENV=test
PORT=8080
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/testdb
S3_BUCKET_NAME=test-bucket
S3_REGION=eu-west-2
S3_ACCESS_KEY_ID=test-key-id
S3_SECRET_ACCESS_KEY=test-secret-key
```

Run tests:
```bash
source .env.test
npm run test
```

## Notes

- **Never commit** `.env` files to Git
- **Always use Key Vault** for sensitive credentials in production
- **Default values**: `S3_REGION` defaults to `eu-west-2` if not set
- **Security**: Managed identities automatically provide credentials to Key Vault
- **Frontend URL**: Should match the internal FQDN of your frontend Container App

---

For more details, see [DEPLOYMENT.md](./DEPLOYMENT.md)
