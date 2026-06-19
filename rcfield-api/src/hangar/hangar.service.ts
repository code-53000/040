import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HangarSlot } from '../entities/hangar-slot.entity';
import { Aircraft } from '../entities/aircraft.entity';
import { Battery } from '../entities/battery.entity';

@Injectable()
export class HangarService {
  constructor(
    @InjectRepository(HangarSlot)
    private slotRepository: Repository<HangarSlot>,
    @InjectRepository(Aircraft)
    private aircraftRepository: Repository<Aircraft>,
    @InjectRepository(Battery)
    private batteryRepository: Repository<Battery>,
  ) {}

  async getAllSlots(query?: any) {
    const qb = this.slotRepository.createQueryBuilder('slot')
      .leftJoinAndSelect('slot.member', 'member');

    if (query?.status) {
      qb.andWhere('slot.status = :status', { status: query.status });
    }
    qb.orderBy('slot.row', 'ASC').addOrderBy('slot.column', 'ASC');

    const page = parseInt(query?.page) || 1;
    const limit = parseInt(query?.limit) || 50;
    qb.skip((page - 1) * limit).take(limit);

    return qb.getManyAndCount();
  }

  async getSlotDetail(id: number) {
    const slot = await this.slotRepository.findOne({
      where: { id },
      relations: { member: true, aircraft: true, batteries: true },
    });
    if (!slot) throw new NotFoundException('机库格位不存在');
    return slot;
  }

  async registerAircraft(memberId: number, dto: any) {
    if (dto.hangarSlotId) {
      const slot = await this.slotRepository.findOne({ where: { id: dto.hangarSlotId } });
      if (!slot) throw new NotFoundException('机库格位不存在');
      if (slot.status === 'occupied' && slot.memberId !== memberId) {
        throw new NotFoundException('该格位已被他人占用');
      }
      if (slot.status === 'maintenance') {
        throw new NotFoundException('该格位维护中');
      }
      await this.slotRepository.update(dto.hangarSlotId, { status: 'occupied', memberId });
    }
    const aircraft = this.aircraftRepository.create({ ...dto, memberId });
    return this.aircraftRepository.save(aircraft);
  }

  async registerBattery(memberId: number, dto: any) {
    if (dto.hangarSlotId) {
      const slot = await this.slotRepository.findOne({ where: { id: dto.hangarSlotId } });
      if (!slot) throw new NotFoundException('机库格位不存在');
      if (slot.status === 'occupied' && slot.memberId !== memberId) {
        throw new NotFoundException('该格位已被他人占用');
      }
    }
    const battery = this.batteryRepository.create({ ...dto, memberId });
    return this.batteryRepository.save(battery);
  }

  async getMyAircraft(memberId: number) {
    return this.aircraftRepository.find({ where: { memberId }, relations: { hangarSlot: true } });
  }

  async getMyBatteries(memberId: number) {
    return this.batteryRepository.find({ where: { memberId }, relations: { hangarSlot: true } });
  }

  async updateAircraft(id: number, memberId: number, dto: any) {
    const aircraft = await this.aircraftRepository.findOne({ where: { id, memberId } });
    if (!aircraft) throw new NotFoundException('飞机不存在');
    Object.assign(aircraft, dto);
    return this.aircraftRepository.save(aircraft);
  }

  async updateBattery(id: number, memberId: number, dto: any) {
    const battery = await this.batteryRepository.findOne({ where: { id, memberId } });
    if (!battery) throw new NotFoundException('电池不存在');
    Object.assign(battery, dto);
    return this.batteryRepository.save(battery);
  }

  async deleteAircraft(id: number, memberId: number) {
    const aircraft = await this.aircraftRepository.findOne({ where: { id, memberId } });
    if (!aircraft) throw new NotFoundException('飞机不存在');
    return this.aircraftRepository.remove(aircraft);
  }

  async deleteBattery(id: number, memberId: number) {
    const battery = await this.batteryRepository.findOne({ where: { id, memberId } });
    if (!battery) throw new NotFoundException('电池不存在');
    return this.batteryRepository.remove(battery);
  }
}
