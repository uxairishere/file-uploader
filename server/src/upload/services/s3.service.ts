import { Injectable } from '@nestjs/common';
import { S3Client, PutObjectCommand, DeleteObjectCommand, ObjectCannedACL } from '@aws-sdk/client-s3';

@Injectable()
export class S3Service {
  private s3Client: S3Client;
  private readonly bucketName: string;
  private readonly endpoint: string;
  private readonly region: string;

  constructor() {
    this.region = process.env.AWS_REGION || 'us-east-1';
    this.endpoint = process.env.S3_ENDPOINT || '';
    this.bucketName = process.env.S3_BUCKET || 'file-uploader';
    
    this.s3Client = new S3Client({
      region: this.region,
      endpoint: this.endpoint ? this.endpoint : undefined,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
      },
      forcePathStyle: true,
    });
  }

  async uploadFile(
    file: Express.Multer.File,
    key: string,
  ): Promise<{ url: string; key: string }> {
    const params = {
      Bucket: this.bucketName,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
      ACL: 'public-read' as ObjectCannedACL,
    };

    const command = new PutObjectCommand(params);
    await this.s3Client.send(command);
    
    // Generate file URL - handle both custom endpoints and AWS standard endpoints
    let url: string;
    
    if (this.endpoint) {
      // Custom endpoint (DigitalOcean, Backblaze, etc)
      url = `${this.endpoint}/${this.bucketName}/${key}`;
    } else {
      // Standard AWS S3 URL
      url = `https://${this.bucketName}.s3.${this.region}.amazonaws.com/${key}`;
    }
    
    return {
      url,
      key,
    };
  }

  async deleteFile(key: string): Promise<void> {
    const params = {
      Bucket: this.bucketName,
      Key: key,
    };

    const command = new DeleteObjectCommand(params);
    await this.s3Client.send(command);
  }
} 