import { createRequire } from "module";
import config from "../../config.mjs";

// aws-sdk v2 is CommonJS; load it safely from ESM (.mjs)
const require = createRequire(import.meta.url);
// eslint-disable-next-line @typescript-eslint/no-var-requires
const AWS = require("aws-sdk");

// Configure AWS SDK from environment / config
AWS.config.update({
  accessKeyId: config.accessKey,
  secretAccessKey: config.secretAccessKey,
  region: config.region,
});

const s3 = new AWS.S3({ apiVersion: "2006-03-01" });

/**
 * Upload a file buffer (from multer) to S3 and return the public URL.
 * @param {Express.Multer.File} file
 * @returns {Promise<string>} public URL of uploaded object
 */
export const uploadFileToS3 = async (file) => {
  if (!file) {
    throw new Error("No file provided for upload");
  }

  const bucketName = process.env.S3_BUCKET;
  if (!bucketName) {
    throw new Error("S3_BUCKET environment variable is not set");
  }

  const key = `book-covers/${Date.now()}-${file.originalname}`;

  const params = {
    Bucket: bucketName,
    Key: key,
    Body: file.buffer,
    ContentType: file.mimetype,
    ACL: "public-read",
  };

  if (typeof s3.upload !== "function") {
    throw new Error(
      "AWS S3 client misconfigured: upload() not available. Check aws-sdk installation/import."
    );
  }

  const data = await s3.upload(params).promise();
  return data.Location;
};
