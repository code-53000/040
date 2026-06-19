import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateRunwayDto } from './dto/create-runway.dto';
import { UpdateRunwayDto } from './dto/update-runway.dto';
import { CreateHangarSlotDto } from './dto/create-hangar-slot.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post('runways')
  async createRunway(@Body() dto: CreateRunwayDto) {
    return this.adminService.createRunway(dto);
  }

  @Get('runways')
  async getAllRunways() {
    return this.adminService.getAllRunways();
  }

  @Put('runways/:id')
  async updateRunway(@Param('id') id: number, @Body() dto: UpdateRunwayDto) {
    return this.adminService.updateRunway(id, dto);
  }

  @Delete('runways/:id')
  async deleteRunway(@Param('id') id: number) {
    return this.adminService.deleteRunway(id);
  }

  @Post('hangar-slots')
  async createHangarSlot(@Body() dto: CreateHangarSlotDto) {
    return this.adminService.createHangarSlot(dto);
  }

  @Get('hangar-slots')
  async getAllHangarSlots() {
    return this.adminService.getAllRunways();
  }

  @Put('hangar-slots/:id')
  async updateHangarSlot(@Param('id') id: number, @Body() dto: any) {
    return this.adminService.updateHangarSlot(id, dto);
  }

  @Delete('hangar-slots/:id')
  async deleteHangarSlot(@Param('id') id: number) {
    return this.adminService.deleteHangarSlot(id);
  }

  @Get('users')
  async getAllUsers(@Query() query) {
    return this.adminService.getAllUsers(query);
  }

  @Get('stats')
  async getStats() {
    return this.adminService.getStats();
  }

  @Put('allocate-frequency/:bookingId')
  async allocateFrequency(@Param('bookingId') bookingId: number, @Body() body: { frequency: number }) {
    return this.adminService.allocateFrequency(bookingId, body.frequency);
  }

  @Get('frequency-usage')
  async getFrequencyUsage(@Query('date') date: string) {
    return this.adminService.getFrequencyUsage(date);
  }
}
