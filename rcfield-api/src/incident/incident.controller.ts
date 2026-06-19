import { Controller, Get, Post, Put, Body, Param, Query, Request, UseGuards } from '@nestjs/common';
import { IncidentService } from './incident.service';
import { CreateFlightRecordDto } from './dto/create-flight-record.dto';
import { CreateIncidentDto } from './dto/create-incident.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@Controller()
@UseGuards(JwtAuthGuard)
export class IncidentController {
  constructor(private readonly incidentService: IncidentService) {}

  @UseGuards(RolesGuard)
  @Roles('safety_officer', 'admin')
  @Post('flight-records')
  async createFlightRecord(@Request() req, @Body() dto: CreateFlightRecordDto) {
    return this.incidentService.createFlightRecord(req.user.userId, dto);
  }

  @Get('flight-records')
  async getFlightRecords(@Query() query) {
    return this.incidentService.getFlightRecords(query);
  }

  @Get('flight-records/:id')
  async getFlightRecord(@Param('id') id: number) {
    return this.incidentService.getFlightRecord(id);
  }

  @Post('incidents')
  async createIncident(@Request() req, @Body() dto: CreateIncidentDto) {
    return this.incidentService.createIncident(req.user.userId, dto);
  }

  @Get('incidents')
  async getIncidents(@Query() query) {
    return this.incidentService.getIncidents(query);
  }

  @Get('incidents/:id')
  async getIncident(@Param('id') id: number) {
    return this.incidentService.getIncident(id);
  }

  @UseGuards(RolesGuard)
  @Roles('safety_officer', 'admin')
  @Put('incidents/:id')
  async updateIncident(@Param('id') id: number, @Body() dto: any) {
    return this.incidentService.updateIncident(id, dto);
  }
}
