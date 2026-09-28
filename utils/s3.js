const { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const crypto = require('crypto');
require('dotenv').config();

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

/**
 * Upload a file to S3
 * @param {Buffer} fileBuffer - The file content
 * @param {string} fileName - Original filename
 * @param {string} mimeType - File MIME type
 * @returns {Promise<string>} - The S3 file URL
 */
const uploadFileToS3 = async (fileBuffer, fileName, mimeType) => {
  // Standardize folder to ecommerce/ for this project
  const sanitizedFileName = (fileName || 'image.jpg').replace(/[^a-zA-Z0-9.-]/g, '_');
  const fileKey = `ecommerce/${crypto.randomBytes(16).toString('hex')}-${sanitizedFileName}`;

  const params = {
    Bucket: process.env.AWS_S3_BUCKET,
    Key: fileKey,
    Body: fileBuffer,
    ContentType: mimeType || 'image/jpeg',
  };

  try {
    const command = new PutObjectCommand(params);
    await s3.send(command);
    return `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileKey}`;
  } catch (error) {
    console.error('S3 Upload Error:', error);
    throw new Error('Failed to upload file to S3');
  }
};

/**
 * Generate presigned URL for viewing
 * @param {String} key - S3 object key
 * @returns {Promise<String>} - Presigned URL
 */
async function getPresignedUrl(key) {
  const command = new GetObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET,
    Key: key,
  });

  try {
    const url = await getSignedUrl(s3, command, { expiresIn: 3600 * 24 * 7 }); // 7 days
    return url;
  } catch (error) {
    console.error('Presigned URL Error:', error);
    throw new Error('Failed to generate presigned URL');
  }
}

/**
 * Delete file from S3
 * @param {String} key - S3 object key
 */
async function deleteFromS3(key) {
  const command = new DeleteObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET,
    Key: key,
  });

  try {
    await s3.send(command);
  } catch (error) {
    console.error('S3 Delete Error:', error);
    throw new Error('Failed to delete image from S3');
  }
}

module.exports = {
  s3,
  uploadFileToS3,
  getPresignedUrl,
  deleteFromS3,
};
