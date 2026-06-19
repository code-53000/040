import { Controller, Get, Post, Put, Delete, Body, Param, Query, Request, UseGuards } from '@nestjs/common';
import { HangarService } from './hangar.service';
import { RegisterAircraftDto } from './dto/register-aircraft.dto';
import { RegisterBatteryDto } from './dto/register-battery.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@Controller('hangar')
@UseGuards(JwtAuthGuard)
export class HangarController {
  constructor(private readonly hangarService: HangarService) {}

  @Get('slots')
  async getAllSlots(@Query() query) {
    return this.hangarService.getAllSlots(query);
  }

  @Get('slots/:id')
  async getSlotDetail(@Param('id') id: number) {
    return this.hangarService.getSlotDetail(id);
  }

  @Get('my-aircraft')
  async getMyAircraft(@Request() req) {
    return this.hangarService.getMyAircraft(req.user.userId);
  }

  @Get('my-batteries')
  async getMyBatteries(@Request() req) {
    return this.hangarService.getMyBatteries(req.user.userId);
  }

  @Post('aircraft')
  async registerAircraft(@Request() req, @Body() dto: RegisterAircraftDto) {
    return this.hangarService.registerAircraft(req.user.userId, dto);
  }

  @Post('battery')
  async registerBattery(@Request() req, @Body() dto: RegisterBatteryDto) {
    return this.hangarService.registerBattery(req.user.userId, dto);
  }

  @Put('aircraft/:id')
  async updateAircraft(@Param('id') id: number, @Request() req, @Body() dto: any) {
    return this.hangarService.updateAircraft(id, req.user.userId, dto);
  }

  @Put('battery/:id')
  async updateBattery(@Param('id') id: number, @Request() req, @Body() dto: any) {
    return this.hangarService.updateBattery(id, req.user.userId, dto);
  }

  @Delete('aircraft/:id')
  async deleteAircraft(@Param('id') id: number, @Request() req) {
    return this.hangarService.deleteAircraft(id, req.user.userId);
  }

  @Delete('battery/:id')
  async deleteBattery(@Param('id') id: number, @Request() req) {
    return this.hangarService.deleteBattery(id, req.user.userId);
  }
}
