import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FlightRecord } from '../entities/flight-record.entity';
import { Incident } from '../entities/incident.entity';

@Injectable()
export class IncidentService {
  constructor(
    @InjectRepository(FlightRecord)
    private recordRepository: Repository<FlightRecord>,
    @InjectRepository(Incident)
    private incidentRepository: Repository<Incident>,
  ) {}

  async createFlightRecord(safetyOfficerId: number, dto: any): Promise<any> {
    const record = this.recordRepository.create({ ...dto, safetyOfficerId });
    return this.recordRepository.save(record);
  }

  async getFlightRecords(query?: any) {
    const qb = this.recordRepository.createQueryBuilder('record')
      .leftJoinAndSelect('record.booking', 'booking')
      .leftJoinAndSelect('record.safetyOfficer', 'officer');

    if (query?.bookingId) {
      qb.andWhere('record.bookingId = :bookingId', { bookingId: query.bookingId });
    }

    qb.orderBy('record.createdAt', 'DESC');
    const page = parseInt(query?.page) || 1;
    const limit = parseInt(query?.limit) || 20;
    qb.skip((page - 1) * limit).take(limit);

    return qb.getManyAndCount();
  }

  async getFlightRecord(id: number) {
    const record = await this.recordRepository.findOne({
      where: { id },
      relations: { booking: true, safetyOfficer: true },
    });
    if (!record) throw new NotFoundException('飞行记录不存在');
    return record;
  }

  async createIncident(reporterId: number, dto: any): Promise<any> {
    const incident = this.incidentRepository.create({ ...dto, reporterId });
    return this.incidentRepository.save(incident);
  }

  async getIncidents(query?: any) {
    const qb = this.incidentRepository.createQueryBuilder('incident')
      .leftJoinAndSelect('incident.flightRecord', 'record')
      .leftJoinAndSelect('incident.reporter', 'reporter');

    if (query?.type) {
      qb.andWhere('incident.type = :type', { type: query.type });
    }
    if (query?.severity) {
      qb.andWhere('incident.severity = :severity', { severity: query.severity });
    }

    qb.orderBy('incident.createdAt', 'DESC');
    const page = parseInt(query?.page) || 1;
    const limit = parseInt(query?.limit) || 20;
    qb.skip((page - 1) * limit).take(limit);

    return qb.getManyAndCount();
  }

  async getIncident(id: number) {
    const incident = await this.incidentRepository.findOne({
      where: { id },
      relations: { flightRecord: true, reporter: true },
    });
    if (!incident) throw new NotFoundException('事故记录不存在');
    return incident;
  }

  async updateIncident(id: number, dto: any) {
    const incident = await this.getIncident(id);
    Object.assign(incident, dto);
    return this.incidentRepository.save(incident);
  }
}
