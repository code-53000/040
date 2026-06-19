import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { Runway } from '../entities/runway.entity';
import { HangarSlot } from '../entities/hangar-slot.entity';
import { FlightBooking } from '../entities/flight-booking.entity';
import { FlightRecord } from '../entities/flight-record.entity';
import { Incident } from '../entities/incident.entity';
import { User } from '../entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Runway, HangarSlot, FlightBooking, FlightRecord, Incident, User])],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
