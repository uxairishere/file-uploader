import {
    BadRequestException,
    Controller,
    Get,
    HttpStatus,
    MaxFileSizeValidator,
    ParseFilePipe,
    Post,
    UploadedFiles,
    UseInterceptors
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FileListResponseDto, FileResponseDto } from '../dtos/file.dto';
import { UploadService } from '../services/upload.service';

@ApiTags('Files')
@Controller('uploads')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('files')
  @ApiOperation({ summary: 'Upload multiple files' })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({ status: HttpStatus.CREATED, type: [FileResponseDto] })
  @UseInterceptors(FilesInterceptor('files', 20)) // Max 20 files at once
  async uploadFiles(
    @UploadedFiles(
      new ParseFilePipe({
        validators: [new MaxFileSizeValidator({ maxSize: 10 * 1024 * 1024 })], // 10MB max
      }),
    )
    files: Express.Multer.File[],
  ) {
    console.log("reached here");
    if (!files || files.length === 0) {
      throw new BadRequestException('No files provided');
    }
    
    return this.uploadService.uploadMultipleFiles(files);
  }

  @Get()
  @ApiOperation({ summary: 'Get all files' })
  @ApiResponse({ status: HttpStatus.OK, type: FileListResponseDto })
  async getAllFiles() {
    const files = await this.uploadService.getAllFiles();
    return { files };
  }
} 