const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const {
	S3Client,
	PutObjectCommand,
	DeleteObjectCommand,
} = require("@aws-sdk/client-s3");
const {
	CloudFrontClient,
	CreateInvalidationCommand,
} = require("@aws-sdk/client-cloudfront");
const { getSignedUrl } = require("@aws-sdk/cloudfront-signer");

const s3 = new S3Client({
	credentials: {
		secretAccessKey: process.env.SECRET_ACCESS_KEY,
		accessKeyId: process.env.ACCESS_KEY_ID,
	},
	region: process.env.BUCKET_REGION,
});

const cloudFront = new CloudFrontClient({
	credentials: {
		secretAccessKey: process.env.SECRET_ACCESS_KEY,
		accessKeyId: process.env.ACCESS_KEY_ID,
	},
	region: process.env.BUCKET_REGION,
});

async function uploadFile({ file, fileName, fileType }) {
	try {
		// Upload file to S3
		const params = {
			Bucket: process.env.BUCKET_NAME,
			Key: fileName,
			Body: file,
			ContentType: fileType,
		};
		const command = new PutObjectCommand(params);
		await s3.send(command);
	} catch (error) {
		throw error;
	}
}

async function deleteFile(fileName) {
	try {
		// Delete the file from S3
		const params = {
			Bucket: process.env.BUCKET_NAME,
			Key: fileName,
		};
		const command = new DeleteObjectCommand(params);
		await s3.send(command);

		// Invalidate the cloud front cache for the deleted file
		const invalidationParams = {
			DistributionId: process.env.CLOUDFRONT_DISTRIBUTION_ID,
			InvalidationBatch: {
				CallerReference: fileName,
				Paths: {
					Quantity: 1,
					Items: ["/" + fileName],
				},
			},
		};
		const invalidationCommand = new CreateInvalidationCommand(
			invalidationParams
		);
		await cloudFront.send(invalidationCommand);
	} catch (error) {
		throw error;
	}
}

async function getFileUrl(fileName) {
	try {
		// Get the cloudfront signed URL
		fileUrl = getSignedUrl({
			url: `${process.env.CLOUDFRONT_DOMAIN_NAME}/${fileName}`,
			dateLessThan: new Date(Date.now() + 1000 * 60 * 60 * 24),
			privateKey: process.env.CLOUDFRONT_PRIVATE_KEY,
			keyPairId: process.env.CLOUDFRONT_KEY_PAIR_ID,
		});
		return fileUrl;
	} catch (error) {
		throw error;
	}
}

module.exports = {
	uploadFile,
	deleteFile,
	getFileUrl,
};
