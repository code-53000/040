import { Controller, Get, Post, Put, Delete, Body, Param, Query, Request, UseGuards } from '@nestjs/common';
import { FlightBookingService } from './flight-booking.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@Controller('flight-bookings')
@UseGuards(JwtAuthGuard)
export class FlightBookingController {
  constructor(private readonly bookingService: FlightBookingService) {}

  @Post()
  async create(@Request() req, @Body() dto: CreateBookingDto) {
    return this.bookingService.create(req.user.userId, dto);
  }

  @Get()
  async findAll(@Query() query) {
    return this.bookingService.findAll(query);
  }

  @Get('runways')
  async getActiveRunways() {
    return this.bookingService.getActiveRunways();
  }

  @Get('available-slots')
  async getAvailableSlots(@Query('runwayId') runwayId: number, @Query('date') date: string) {
    return this.bookingService.getAvailableSlots(runwayId, date);
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.bookingService.findOne(id);
  }

  @UseGuards(RolesGuard)
  @Roles('safety_officer', 'admin')
  @Put(':id/review')
  async review(@Param('id') id: number, @Body() dto: UpdateBookingDto, @Request() req) {
    return this.bookingService.review(id, dto.status, req.user.userId, dto.reviewNote);
  }

  @Put(':id/cancel')
  async cancel(@Param('id') id: number, @Request() req) {
    return this.bookingService.cancel(id, req.user.userId);
  }
}
