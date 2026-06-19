import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Runway } from '../entities/runway.entity';
import { HangarSlot } from '../entities/hangar-slot.entity';
import { FlightBooking } from '../entities/flight-booking.entity';
import { FlightRecord } from '../entities/flight-record.entity';
import { Incident } from '../entities/incident.entity';
import { User } from '../entities/user.entity';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Runway)
    private runwayRepository: Repository<Runway>,
    @InjectRepository(HangarSlot)
    private hangarSlotRepository: Repository<HangarSlot>,
    @InjectRepository(FlightBooking)
    private bookingRepository: Repository<FlightBooking>,
    @InjectRepository(FlightRecord)
    private recordRepository: Repository<FlightRecord>,
    @InjectRepository(Incident)
    private incidentRepository: Repository<Incident>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async createRunway(dto: any) {
    const runway = this.runwayRepository.create(dto);
    return this.runwayRepository.save(runway);
  }

  async updateRunway(id: number, dto: any) {
    const runway = await this.runwayRepository.findOne({ where: { id } });
    if (!runway) throw new NotFoundException('跑道不存在');
    Object.assign(runway, dto);
    return this.runwayRepository.save(runway);
  }

  async deleteRunway(id: number) {
    const runway = await this.runwayRepository.findOne({ where: { id } });
    if (!runway) throw new NotFoundException('跑道不存在');
    return this.runwayRepository.remove(runway);
  }

  async getAllRunways() {
    return this.runwayRepository.find({ order: { code: 'ASC' } });
  }

  async getAllHangarSlots() {
    return this.hangarSlotRepository.find({ order: { row: 'ASC', column: 'ASC' } });
  }

  async createHangarSlot(dto: any) {
    const slot = this.hangarSlotRepository.create(dto);
    return this.hangarSlotRepository.save(slot);
  }

  async updateHangarSlot(id: number, dto: any) {
    const slot = await this.hangarSlotRepository.findOne({ where: { id } });
    if (!slot) throw new NotFoundException('格位不存在');
    Object.assign(slot, dto);
    return this.hangarSlotRepository.save(slot);
  }

  async deleteHangarSlot(id: number) {
    const slot = await this.hangarSlotRepository.findOne({ where: { id } });
    if (!slot) throw new NotFoundException('格位不存在');
    return this.hangarSlotRepository.remove(slot);
  }

  async getAllUsers(query?: any) {
    const qb = this.userRepository.createQueryBuilder('user');
    if (query?.role) {
      qb.andWhere('user.role = :role', { role: query.role });
    }
    return qb.getMany();
  }

  async getStats() {
    const totalBookings = await this.bookingRepository.count();
    const totalIncidents = await this.incidentRepository.count();
    const activeRunways = await this.runwayRepository.count({ where: { status: 'active' } });
    const totalMembers = await this.userRepository.count({ where: { role: 'member' } });
    const pendingBookings = await this.bookingRepository.count({ where: { status: 'pending' } });

    const recentBookings = await this.bookingRepository
      .createQueryBuilder('b')
      .select("DATE(b.date)", "date")
      .addSelect("COUNT(*)", "count")
      .groupBy("DATE(b.date)")
      .orderBy("DATE(b.date)", "DESC")
      .limit(30)
      .getRawMany();

    const incidentByType = await this.incidentRepository
      .createQueryBuilder('i')
      .select("i.type", "type")
      .addSelect("COUNT(*)", "count")
      .groupBy("i.type")
      .getRawMany();

    const bookingByStatus = await this.bookingRepository
      .createQueryBuilder('b')
      .select("b.status", "status")
      .addSelect("COUNT(*)", "count")
      .groupBy("b.status")
      .getRawMany();

    const runwayUsage = await this.bookingRepository
      .createQueryBuilder('b')
      .leftJoinAndSelect('b.runway', 'r')
      .select("r.name", "runway")
      .addSelect("COUNT(*)", "count")
      .groupBy("r.name")
      .getRawMany();

    return {
      totalBookings,
      totalIncidents,
      activeRunways,
      totalMembers,
      pendingBookings,
      recentBookings,
      incidentByType,
      bookingByStatus,
      runwayUsage,
    };
  }

  async allocateFrequency(bookingId: number, frequency: number) {
    const booking = await this.bookingRepository.findOne({ where: { id: bookingId } });
    if (!booking) throw new NotFoundException('预约不存在');
    booking.frequency = frequency;
    return this.bookingRepository.save(booking);
  }

  async getFrequencyUsage(date: string) {
    return this.bookingRepository.find({
      where: { date, status: In(['pending', 'approved']) },
      relations: { member: true, runway: true },
      order: { frequency: 'ASC', startTime: 'ASC' },
    });
  }
}
