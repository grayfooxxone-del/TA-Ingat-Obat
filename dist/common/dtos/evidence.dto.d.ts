export declare class CreateEvidenceDto {
    userId: string;
    scheduleId: string;
    type: 'photo' | 'video';
    fileUrl?: string;
    note?: string;
    description?: string;
}
export declare class UpdateEvidenceDto {
    verified?: boolean;
    verifiedAt?: Date;
    verifiedBy?: string;
}
export declare class EvidenceResponseDto {
    id: string;
    userId: string;
    scheduleId: string;
    type: 'photo' | 'video';
    filePath?: string;
    fileUrl?: string;
    uploadedAt: Date;
    verified: boolean;
    verifiedAt?: Date;
    verifiedBy?: string;
    status?: string;
    note?: string;
}
