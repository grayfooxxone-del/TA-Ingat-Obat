import { EvidenceService } from './evidence.service';
import { CreateEvidenceDto, UpdateEvidenceDto } from '../../common/dtos/evidence.dto';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
export declare class EvidenceController {
    private evidenceService;
    private cloudinaryService;
    constructor(evidenceService: EvidenceService, cloudinaryService: CloudinaryService);
    uploadEvidence(createEvidenceDto: CreateEvidenceDto, file?: Express.Multer.File): Promise<{
        message: string;
        data: import("../../common/dtos/evidence.dto").EvidenceResponseDto;
    }>;
    getEvidenceByUser(userId: string): Promise<{
        data: import("../../common/dtos/evidence.dto").EvidenceResponseDto[];
    }>;
    getEvidenceById(evidenceId: string): Promise<{
        data: import("../../common/dtos/evidence.dto").EvidenceResponseDto;
    }>;
    verifyEvidence(evidenceId: string, updateEvidenceDto: UpdateEvidenceDto): Promise<{
        message: string;
        data: import("../../common/dtos/evidence.dto").EvidenceResponseDto;
    }>;
    getPendingEvidenceForPMO(): Promise<{
        data: import("../../common/dtos/evidence.dto").EvidenceResponseDto[];
    }>;
}
