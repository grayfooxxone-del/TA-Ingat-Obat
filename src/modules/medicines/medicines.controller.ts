import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Body,
  Param,
  Headers,
} from '@nestjs/common';
import { MedicineService } from './medicines.service';
import {
  CreateMedicineDto,
  UpdateMedicineDto,
} from '../../common/dtos/medicine.dto';

@Controller('medicines')
export class MedicineController {
  constructor(private medicineService: MedicineService) {}

  @Post()
  async createMedicine(@Body() createMedicineDto: CreateMedicineDto) {
    const medicine =
      await this.medicineService.createMedicine(createMedicineDto);
    return {
      message: 'Medicine created successfully',
      data: medicine,
    };
  }

  @Get('user/:userId')
  async getMedicinesByUser(@Param('userId') userId: string) {
    const medicines = await this.medicineService.getMedicinesByUser(userId);
    return {
      data: medicines,
    };
  }

  @Get(':id')
  async getMedicineById(@Param('id') medicineId: string) {
    const medicine = await this.medicineService.getMedicineById(medicineId);
    return {
      data: medicine,
    };
  }

  @Put(':id')
  async updateMedicine(
    @Param('id') medicineId: string,
    @Body() updateMedicineDto: UpdateMedicineDto,
  ) {
    const medicine = await this.medicineService.updateMedicine(
      medicineId,
      updateMedicineDto,
    );
    return {
      message: 'Medicine updated successfully',
      data: medicine,
    };
  }

  @Delete(':id')
  async deleteMedicine(@Param('id') medicineId: string) {
    await this.medicineService.deleteMedicine(medicineId);
    return {
      message: 'Medicine deleted successfully',
    };
  }
}
