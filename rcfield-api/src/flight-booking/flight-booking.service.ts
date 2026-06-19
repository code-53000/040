import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { FlightBooking } from '../entities/flight-booking.entity';
import { ConflictCheckService } from '../conflict-check/conflict-check.service';
import { CreateBookingDto } from './dto/create-booking.dto';

@Injectable()
export class FlightBookingService {
  constructor(
    @InjectRepository(FlightBooking)
    private bookingRepository: Repository<FlightBooking>,
    private conflictCheckService: ConflictCheckService,
  ) {}

  async create(memberId: number, dto: CreateBookingDto): Promise<FlightBooking> {
    await this.conflictCheckService.validateBooking(
      dto.runwayId,
      dto.date,
      dto.startTime,
      dto.endTime,
      dto.frequency,
    );
    const booking = this.bookingRepository.create({
      ...dto,
      memberId,
      status: 'pending',
    });
    return this.bookingRepository.save(booking);
  }

  async findAll(query?: any): Promise<[FlightBooking[], number]> {
    const qb = this.bookingRepository.createQueryBuilder('booking')
      .leftJoinAndSelect('booking.member', 'member')
      .leftJoinAndSelect('booking.runway', 'runway')
      .leftJoinAndSelect('booking.aircraft', 'aircraft')
      .leftJoinAndSelect('booking.reviewedBy', 'reviewer');

    if (query?.status) {
      qb.andWhere('booking.status = :status', { status: query.status });
    }
    if (query?.date) {
      qb.andWhere('booking.date = :date', { date: query.date });
    }
    if (query?.memberId) {
      qb.andWhere('booking.memberId = :memberId', { memberId: query.memberId });
    }
    if (query?.runwayId) {
      qb.andWhere('booking.runwayId = :runwayId', { runwayId: query.runwayId });
    }

    qb.orderBy('booking.date', 'DESC').addOrderBy('booking.startTime', 'ASC');

    const page = parseInt(query?.page) || 1;
    const limit = parseInt(query?.limit) || 20;
    qb.skip((page - 1) * limit).take(limit);

    return qb.getManyAndCount();
  }

  async findOne(id: number): Promise<FlightBooking> {
    const booking = await this.bookingRepository.findOne({
      where: { id },
      relations: { member: true, runway: true, aircraft: true, reviewedBy: true },
    });
    if (!booking) {
      throw new NotFoundException('预约不存在');
    }
    return booking;
  }

  async review(id: number, status: string, reviewedById: number, reviewNote?: string): Promise<FlightBooking> {
    const booking = await this.findOne(id);
    booking.status = status;
    booking.reviewedById = reviewedById;
    if (reviewNote) {
      booking.reviewNote = reviewNote;
    }
    return this.bookingRepository.save(booking);
  }

  async cancel(id: number, memberId: number): Promise<FlightBooking> {
    const booking = await this.findOne(id);
    if (booking.memberId !== memberId) {
      throw new NotFoundException('无权取消此预约');
    }
    booking.status = 'cancelled';
    return this.bookingRepository.save(booking);
  }

  async getAvailableSlots(runwayId: number, date: string) {
    const bookings = await this.bookingRepository.find({
      where: { runwayId, date, status: In(['pending', 'approved']) },
      order: { startTime: 'ASC' },
    });
    return bookings;
  }
}
