import {
  Controller,
  Get,
  Post,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { ApiTags, ApiOperation, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { DocsService } from './docs.service';

@ApiTags('Docs')
@Controller('docs')
export class DocsController {
  constructor(private readonly docsService: DocsService) {}

  @Get()
  @ApiOperation({ summary: 'Listar archivos almacenados en S3' })
  async listarArchivos() {
    return await this.docsService.listarArchivos();
  }

  @Post('upload')
  @ApiOperation({ summary: 'Subir un archivo a S3' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' },
      },
    },
  })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
    }),
  )
  async uploadFile(
    @UploadedFile()
    file: Express.Multer.File,
  ) {
    return await this.docsService.upload(file.originalname, file.buffer);
  }

  @Post('upload-masivo')
  @ApiOperation({ summary: 'Subir múltiples archivos a S3' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        files: {
          type: 'array',
          items: { type: 'string', format: 'binary' },
        },
      },
    },
  })
  @UseInterceptors(
    FilesInterceptor('files', 20, {
      storage: memoryStorage(),
    }),
  )
  async uploadMasivo(
    @UploadedFiles()
    files: Express.Multer.File[],
  ) {
    return await this.docsService.uploadMasivo(files);
  }
}
