import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConflictCheckService } from './conflict-check.service';
import { FlightBooking } from '../entities/flight-booking.entity';

@Module({
  imports: [TypeOrmModule.forFeature([FlightBooking])],
  providers: [ConflictCheckService],
  exports: [ConflictCheckService],
})
export class ConflictCheckModule {}
