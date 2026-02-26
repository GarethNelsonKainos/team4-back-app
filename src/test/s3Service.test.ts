import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { S3Service } from "../services/s3Service";

const {
	sendMock,
	uploadDoneMock,
	uploadConstructorMock,
	deleteObjectCommandMock,
	s3ClientConstructorMock,
} = vi.hoisted(() => ({
	sendMock: vi.fn(),
	uploadDoneMock: vi.fn(),
	uploadConstructorMock: vi.fn(),
	deleteObjectCommandMock: vi.fn(),
	s3ClientConstructorMock: vi.fn(),
}));

vi.mock("@aws-sdk/client-s3", () => ({
	S3Client: class S3ClientMock {
		constructor(options: unknown) {
			s3ClientConstructorMock(options);
			(this as unknown as { send: unknown }).send = sendMock;
		}
	},
	DeleteObjectCommand: class DeleteObjectCommandMock {
		constructor(input: unknown) {
			deleteObjectCommandMock(input);
		}
	},
}));

vi.mock("@aws-sdk/lib-storage", () => ({
	Upload: class UploadMock {
		constructor(params: unknown) {
			uploadConstructorMock(params);
		}

		done() {
			return uploadDoneMock();
		}
	},
}));

vi.mock("uuid", () => ({
	v4: () => "uuid-123",
}));

const buildFile = () =>
	({
		originalname: "cv.pdf",
		buffer: Buffer.from("fake-cv"),
		mimetype: "application/pdf",
	}) as Express.Multer.File;

describe("S3Service", () => {
	const originalEnv = { ...process.env };

	beforeEach(() => {
		vi.clearAllMocks();
		process.env = { ...originalEnv };
		s3ClientConstructorMock.mockImplementation(() => undefined);
	});

	afterEach(() => {
		process.env = { ...originalEnv };
	});

	it("should throw when configuration is missing in non-test env", () => {
		process.env.NODE_ENV = "production";
		delete process.env.S3_BUCKET_NAME;
		delete process.env.AWS_REGION;
		delete process.env.AWS_ACCESS_KEY_ID;
		delete process.env.AWS_SECRET_ACCESS_KEY;

		expect(() => new S3Service()).toThrow(
			"AWS S3 configuration is missing. Please check your environment variables.",
		);
	});

	it("should not throw when configuration is present in non-test env", () => {
		process.env.NODE_ENV = "production";
		process.env.S3_BUCKET_NAME = "test-bucket";
		process.env.AWS_REGION = "us-east-1";
		process.env.AWS_ACCESS_KEY_ID = "key";
		process.env.AWS_SECRET_ACCESS_KEY = "secret";

		expect(() => new S3Service()).not.toThrow();
	});

	it("should upload a CV and return the URL", async () => {
		process.env.NODE_ENV = "test";
		process.env.S3_BUCKET_NAME = "test-bucket";
		process.env.AWS_REGION = "us-east-1";
		process.env.AWS_ACCESS_KEY_ID = "key";
		process.env.AWS_SECRET_ACCESS_KEY = "secret";
		uploadDoneMock.mockResolvedValue(undefined);

		const service = new S3Service();
		const result = await service.uploadCV(buildFile(), 42);

		expect(uploadConstructorMock).toHaveBeenCalled();
		expect(uploadDoneMock).toHaveBeenCalled();
		expect(result).toBe(
			"https://test-bucket.s3.us-east-1.amazonaws.com/cvs/42/uuid-123.pdf",
		);
	});

	it("should throw when upload fails", async () => {
		process.env.NODE_ENV = "test";
		process.env.S3_BUCKET_NAME = "test-bucket";
		process.env.AWS_REGION = "us-east-1";
		process.env.AWS_ACCESS_KEY_ID = "key";
		process.env.AWS_SECRET_ACCESS_KEY = "secret";
		uploadDoneMock.mockRejectedValue(new Error("Upload failed"));

		const service = new S3Service();

		await expect(service.uploadCV(buildFile(), 42)).rejects.toThrow(
			"Failed to upload file to S3",
		);
	});

	it("should delete a CV", async () => {
		process.env.NODE_ENV = "test";
		process.env.S3_BUCKET_NAME = "test-bucket";
		process.env.AWS_REGION = "us-east-1";
		process.env.AWS_ACCESS_KEY_ID = "key";
		process.env.AWS_SECRET_ACCESS_KEY = "secret";

		const service = new S3Service();
		const fileUrl =
			"https://test-bucket.s3.us-east-1.amazonaws.com/cvs/42/uuid-123.pdf";

		await service.deleteCV(fileUrl);

		expect(deleteObjectCommandMock).toHaveBeenCalledWith({
			Bucket: "test-bucket",
			Key: "cvs/42/uuid-123.pdf",
		});
		expect(sendMock).toHaveBeenCalled();
	});

	it("should throw when delete fails", async () => {
		process.env.NODE_ENV = "test";
		process.env.S3_BUCKET_NAME = "test-bucket";
		process.env.AWS_REGION = "us-east-1";
		process.env.AWS_ACCESS_KEY_ID = "key";
		process.env.AWS_SECRET_ACCESS_KEY = "secret";

		const service = new S3Service();

		await expect(service.deleteCV("not-a-url")).rejects.toThrow(
			"Failed to delete file from S3",
		);
	});

	it("should return the file URL for signed URL", async () => {
		process.env.NODE_ENV = "test";
		process.env.S3_BUCKET_NAME = "test-bucket";
		process.env.AWS_REGION = "us-east-1";
		process.env.AWS_ACCESS_KEY_ID = "key";
		process.env.AWS_SECRET_ACCESS_KEY = "secret";

		const service = new S3Service();
		const result = await service.getSignedUrl("https://example.com/file");

		expect(result).toBe("https://example.com/file");
	});
});
