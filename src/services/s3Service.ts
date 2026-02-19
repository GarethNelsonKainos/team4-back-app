import { DeleteObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import { v4 as uuidv4 } from "uuid";

export class S3Service {
	private s3Client: S3Client;
	private bucketName: string;

	constructor() {
		this.s3Client = new S3Client({
			region: process.env.AWS_REGION,
			credentials: {
				accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
				secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
			},
		});
		this.bucketName = process.env.S3_BUCKET_NAME || "";

		if (
			!this.bucketName ||
			!process.env.AWS_REGION ||
			!process.env.AWS_ACCESS_KEY_ID ||
			!process.env.AWS_SECRET_ACCESS_KEY
		) {
			throw new Error(
				"AWS S3 configuration is missing. Please check your environment variables.",
			);
		}
	}

	async uploadCV(file: Express.Multer.File, userId: number): Promise<string> {
		try {
			const fileExtension = file.originalname.split(".").pop();
			const fileName = `cvs/${userId}/${uuidv4()}.${fileExtension}`;

			const upload = new Upload({
				client: this.s3Client,
				params: {
					Bucket: this.bucketName,
					Key: fileName,
					Body: file.buffer,
					ContentType: file.mimetype,
					Metadata: {
						originalName: file.originalname,
						userId: userId.toString(),
						uploadedAt: new Date().toISOString(),
					},
				},
			});

			await upload.done();

			// Return the S3 URL
			return `https://${this.bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;
		} catch (error) {
			console.error("Error uploading file to S3:", error);
			throw new Error("Failed to upload file to S3");
		}
	}

	async deleteCV(fileUrl: string): Promise<void> {
		try {
			// Extract the key from the S3 URL
			const url = new URL(fileUrl);
			const key = url.pathname.substring(1); // Remove leading slash

			const command = new DeleteObjectCommand({
				Bucket: this.bucketName,
				Key: key,
			});

			await this.s3Client.send(command);
		} catch (error) {
			console.error("Error deleting file from S3:", error);
			throw new Error("Failed to delete file from S3");
		}
	}

	async getSignedUrl(
		fileUrl: string,
		_expiresIn: number = 3600,
	): Promise<string> {
		try {
			// For simple use cases, you can return the direct URL
			// For private buckets, you'd use getSignedUrl from @aws-sdk/s3-request-presigner
			return fileUrl;
		} catch (error) {
			console.error("Error generating signed URL:", error);
			throw new Error("Failed to generate signed URL");
		}
	}
}
