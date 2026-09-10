import { Controller, Post, Get, Delete, Param, Body } from '@nestjs/common';
import { PMOService } from './pmo.service';
import { PairPatientDto, PMOVerificationDto } from '../../common/dtos/pmo.dto';

@Controller('pmo')
export class PMOController {
  constructor(private pmoService: PMOService) {}

  @Post('pair-patient')
  async pairPatient(
    @Body() body: { pmoId: string; pairPatientDto: PairPatientDto },
  ) {
    return await this.pmoService.pairPatient(body.pmoId, body.pairPatientDto);
  }

  @Get(':pmoId/monitored-patients')
  async getMonitoredPatients(@Param('pmoId') pmoId: string) {
    const patients = await this.pmoService.getMonitoredPatients(pmoId);
    return {
      data: patients,
    };
  }

  @Get('patient/:patientId')
  async getConnectedPMOs(@Param('patientId') patientId: string) {
    const pmos = await this.pmoService.getConnectedPMOs(patientId);
    return {
      data: pmos,
    };
  }

  @Get(':pmoId/dashboard')
  async getDashboardData(@Param('pmoId') pmoId: string) {
    const data = await this.pmoService.getDashboardData(pmoId);
    return {
      data: data,
    };
  }

  @Get(':pmoId/evidence')
  async getPendingEvidence(@Param('pmoId') pmoId: string) {
    const evidence = await this.pmoService.getPendingEvidence(pmoId);
    return {
      data: evidence,
    };
  }

  @Delete('pairing/:pairingId')
  async unpairPatient(@Param('pairingId') pairingId: string) {
    await this.pmoService.unpairPatient(pairingId);
    return {
      message: 'Patient unpaired successfully',
    };
  }

  @Delete(':pmoId/patient/:patientId')
  async unpairPatientByPmoAndPatient(
    @Param('pmoId') pmoId: string,
    @Param('patientId') patientId: string,
  ) {
    await this.pmoService.unpairPatientByPmoAndPatient(pmoId, patientId);
    return {
      message: 'Patient unpaired successfully',
    };
  }

  @Post('verify-evidence')
  async verifyEvidence(
    @Body() body: { pmoId: string; verificationDto: PMOVerificationDto },
  ) {
    return await this.pmoService.verifyEvidence(
      body.pmoId,
      body.verificationDto,
    );
  }

  @Post('remind-patient')
  async remindPatient(@Body() body: { pmoId: string; patientId: string }) {
    await this.pmoService.remindPatient(body.pmoId, body.patientId);
    return {
      message: 'Reminder sent successfully',
    };
  }
}
