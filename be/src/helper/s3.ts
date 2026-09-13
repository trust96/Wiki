import { DeleteObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { AWS_PUBLIC_KEY, AWS_REGION, AWS_SECRET_KEY, BUCKET_NAME } from "./constants";

const client = new S3Client({
  region: AWS_REGION,
  credentials: {
    accessKeyId: AWS_PUBLIC_KEY,
    secretAccessKey: AWS_SECRET_KEY,
  },
});

export const putObject = async (key: string, file: Buffer) => {
  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
    Body: file,
  });
  await client.send(command);
};

export const deleteObject = async (key: string) => {
  const command = new DeleteObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
  });
  await client.send(command);
};
