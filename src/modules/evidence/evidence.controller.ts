import {
  Controller,
  Post,
  Get,
  Put,
  Param,
  Body,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { EvidenceService } from './evidence.service';
import {
  CreateEvidenceDto,
  UpdateEvidenceDto,
} from '../../common/dtos/evidence.dto';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Controller('evidence')
export class EvidenceController {
  constructor(
    private evidenceService: EvidenceService,
    private cloudinaryService: CloudinaryService,
  ) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async uploadEvidence(
    @Body() createEvidenceDto: CreateEvidenceDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    if (file) {
      const uploadResult = await this.cloudinaryService.uploadFile(file);
      if ('secure_url' in uploadResult) {
        createEvidenceDto.fileUrl = uploadResult.secure_url as string;
      }
    }

    if (!createEvidenceDto.fileUrl) {
      throw new BadRequestException(
        'File bukti harus diunggah atau URL bukti harus disediakan',
      );
    }

    const evidence =
      await this.evidenceService.uploadEvidence(createEvidenceDto);
    return {
      message: 'Evidence uploaded successfully',
      data: evidence,
    };
  }

  @Get('user/:userId')
  async getEvidenceByUser(@Param('userId') userId: string) {
    const evidences = await this.evidenceService.getEvidenceByUser(userId);
    return {
      data: evidences,
    };
  }

  @Get(':id')
  async getEvidenceById(@Param('id') evidenceId: string) {
    const evidence = await this.evidenceService.getEvidenceById(evidenceId);
    return {
      data: evidence,
    };
  }

  @Put(':id/verify')
  async verifyEvidence(
    @Param('id') evidenceId: string,
    @Body() updateEvidenceDto: UpdateEvidenceDto,
  ) {
    const evidence = await this.evidenceService.verifyEvidence(
      evidenceId,
      updateEvidenceDto,
    );
    return {
      message: 'Evidence verified successfully',
      data: evidence,
    };
  }

  @Get('pmo/:pmoId/pending')
  async getPendingEvidenceForPMO() {
    const evidences = await this.evidenceService.getPendingEvidenceForPMO();
    return {
      data: evidences,
    };
  }
}
