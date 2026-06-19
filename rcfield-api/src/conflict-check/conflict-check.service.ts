import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not, In } from 'typeorm';
import { FlightBooking } from '../entities/flight-booking.entity';

@Injectable()
export class ConflictCheckService {
  constructor(
    @InjectRepository(FlightBooking)
    private bookingRepository: Repository<FlightBooking>,
  ) {}

  async checkTimeSlotConflict(runwayId: number, date: string, startTime: string, endTime: string, excludeBookingId?: number): Promise<FlightBooking[]> {
    const where: any = {
      runwayId,
      date,
      status: In(['pending', 'approved']),
    };
    if (excludeBookingId) {
      where.id = Not(excludeBookingId);
    }
    const bookings = await this.bookingRepository.find({ where });
    return bookings.filter(booking => {
      return startTime < booking.endTime && endTime > booking.startTime;
    });
  }

  async checkFrequencyConflict(date: string, startTime: string, endTime: string, frequency: number, excludeBookingId?: number): Promise<FlightBooking[]> {
    const where: any = {
      date,
      frequency,
      status: In(['pending', 'approved']),
    };
    if (excludeBookingId) {
      where.id = Not(excludeBookingId);
    }
    const bookings = await this.bookingRepository.find({ where });
    return bookings.filter(booking => {
      return startTime < booking.endTime && endTime > booking.startTime;
    });
  }

  async validateBooking(runwayId: number, date: string, startTime: string, endTime: string, frequency?: number, excludeBookingId?: number) {
    const timeConflicts = await this.checkTimeSlotConflict(runwayId, date, startTime, endTime, excludeBookingId);
    if (timeConflicts.length > 0) {
      throw new BadRequestException(`时段冲突：该跑道在 ${startTime}-${endTime} 已有预约`);
    }

    if (frequency) {
      const freqConflicts = await this.checkFrequencyConflict(date, startTime, endTime, frequency, excludeBookingId);
      if (freqConflicts.length > 0) {
        throw new BadRequestException(`频率冲突：${frequency}MHz 在此时段已被占用`);
      }
    }

    return true;
  }
}
