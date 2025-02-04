import { Request, Response } from 'express';
import { S3Client, PutObjectCommand, ObjectCannedACL } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!
  }
});

export const uploadProfilePic = async (req: Request, res: Response):Promise<void> => {
  try {
    if (!req.file) {
       res.status(400).json({ message: 'No file uploaded' });
       return
    }

    const folder = req.body.folder || 'user-profile-images';
    const fileName = `${folder}/${uuidv4()}-${req.file.originalname}`;
    const bucketName = process.env.AWS_BUCKET_NAME!;

    const uploadParams = {
      Bucket: bucketName,
      Key: fileName,
      Body: req.file.buffer,
      ContentType: req.file.mimetype,
      ACL: ObjectCannedACL.public_read
    };

    const command = new PutObjectCommand(uploadParams);
    await s3Client.send(command);

    const imageUrl = `https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;
    res.status(200).json({ imageUrl });
  } catch (error) {
    console.error('S3 Upload Error:', error);
    res.status(500).json({ message: 'Image upload failed', error });
  }
};

