import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { File, FileDocument } from '../schemas/file.schema';
import { S3Service } from './s3.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UploadService {
  private readonly logger = new Logger(UploadService.name);
  private uploadQueue: { file: Express.Multer.File; resolve: Function; reject: Function }[] = [];
  private processing = 0;
  private readonly MAX_CONCURRENT_UPLOADS = 3;

  constructor(
    @InjectModel(File.name) private fileModel: Model<FileDocument>,
    private readonly s3Service: S3Service,
  ) {
    // Start the queue processor
    this.processQueue();
  }

  async uploadFile(file: Express.Multer.File): Promise<File> {
    return new Promise((resolve, reject) => {
      // Add to queue
      this.uploadQueue.push({ file, resolve, reject });
      this.logger.log(`Added file to queue: ${file.originalname}. Queue size: ${this.uploadQueue.length}`);
    });
  }

  async uploadMultipleFiles(files: Express.Multer.File[]): Promise<File[]> {
    const uploadPromises = files.map(file => this.uploadFile(file));
    return Promise.all(uploadPromises);
  }

  private async processQueue() {
    if (this.uploadQueue.length === 0 || this.processing >= this.MAX_CONCURRENT_UPLOADS) {
      // Wait a bit before checking the queue again
      setTimeout(() => this.processQueue(), 100);
      return;
    }

    this.processing += 1;
    const queueItem = this.uploadQueue.shift();
    
    if (!queueItem) {
      this.processing -= 1;
      setTimeout(() => this.processQueue(), 100);
      return;
    }
    
    const { file, resolve, reject } = queueItem;

    try {
      this.logger.log(`Processing file: ${file.originalname}. Remaining in queue: ${this.uploadQueue.length}`);
      
      // Generate a unique key for S3
      const fileKey = `${uuidv4()}-${file.originalname}`;
      
      // Upload to S3 first
      const uploadResult = await this.s3Service.uploadFile(file, fileKey);
      
      // Create and save the file document with all fields set
      const newFile = new this.fileModel({
        originalName: file.originalname,
        mimeType: file.mimetype,
        size: file.size,
        key: fileKey,
        url: uploadResult.url,
        status: 'completed',
      });
      
      await newFile.save();
      
      resolve(newFile);
    } catch (error) {
      this.logger.error(`Upload failed for file: ${file.originalname}`, error);
      reject(error);
    } finally {
      this.processing -= 1;
      // Continue processing the queue
      setTimeout(() => this.processQueue(), 0);
    }
  }

  async getAllFiles(): Promise<File[]> {
    return this.fileModel.find().sort({ createdAt: -1 }).exec();
  }
} 