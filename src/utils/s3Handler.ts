import AWS from "aws-sdk";
import { v4 as uuidv4 } from "uuid";
import { Request, Response } from "express";
import sharp from "sharp";

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

export const uploadToS3 = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ message: "No file uploaded" });
      return;
    }

    if (!req.body.folder) {
      res.status(400).json({ message: "Folder name is required" });
      return;
    }

    const allowedMimeTypes = ["image/jpeg", "image/png", "application/pdf"];
    const file = req.file;

    if (!allowedMimeTypes.includes(file.mimetype)) {
      res.status(400).json({ message: "Invalid file type" });
      return;
    }

    const folder = req.body.folder.replace(/[^a-zA-Z0-9-_]/g, "");

    const fileExtension = file.originalname.split(".").pop();
    const fileName = `${folder}/${uuidv4()}.${fileExtension}`;

    let processedBuffer: Buffer = file.buffer;

    if (file.mimetype.startsWith("image/")) {
      processedBuffer = await sharp(file.buffer)
        .resize(200, 200, { fit: "cover" })
        .toBuffer();
    }

    const uploadParams = {
      Bucket: "agriconnect-bucket",
      Key: fileName,
      Body: processedBuffer,
      ContentType: file.mimetype,
    };

    const result = await s3.upload(uploadParams).promise();

    res.json({
      fileUrl: result.Location,
      key: result.Key,
    });
  } catch (error) {
    console.error("S3 upload error:", error);
    res.status(500).json({
      message: "Error uploading file to S3",
      errorDetails: error instanceof Error ? error.message : String(error),
    });
  }
};
