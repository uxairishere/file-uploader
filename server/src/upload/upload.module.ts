import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MulterModule } from '@nestjs/platform-express';
import { ThrottlerModule } from '@nestjs/throttler';
import { UploadController } from './controllers/upload.controller';
import { UploadService } from './services/upload.service';
import { S3Service } from './services/s3.service';
import { File, FileSchema } from './schemas/file.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: File.name, schema: FileSchema }]),
    MulterModule.register({
      limits: {
        fileSize: 10 * 1024 * 1024, // 10MB
      },
    }),
    ThrottlerModule.forRoot([{
      ttl: 60,
      limit: 10, // 10 requests per minute
    }]),
  ],
  controllers: [UploadController],
  providers: [UploadService, S3Service],
  exports: [UploadService, S3Service],
})
export class UploadModule {} 