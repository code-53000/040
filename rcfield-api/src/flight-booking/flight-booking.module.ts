import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FlightBookingController } from './flight-booking.controller';
import { FlightBookingService } from './flight-booking.service';
import { FlightBooking } from '../entities/flight-booking.entity';
import { ConflictCheckModule } from '../conflict-check/conflict-check.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([FlightBooking]),
    ConflictCheckModule,
    AuthModule,
  ],
  controllers: [FlightBookingController],
  providers: [FlightBookingService],
  exports: [FlightBookingService],
})
export class FlightBookingModule {}
