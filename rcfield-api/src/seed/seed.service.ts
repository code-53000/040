import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from '../entities/user.entity';
import { Runway } from '../entities/runway.entity';
import { HangarSlot } from '../entities/hangar-slot.entity';

@Injectable()
export class SeedService implements OnModuleInit {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Runway)
    private runwayRepository: Repository<Runway>,
    @InjectRepository(HangarSlot)
    private hangarSlotRepository: Repository<HangarSlot>,
  ) {}

  async onModuleInit() {
    const userCount = await this.userRepository.count();
    if (userCount > 0) return;

    const adminPassword = await bcrypt.hash('admin123', 10);
    const safetyPassword = await bcrypt.hash('safety123', 10);
    const memberPassword = await bcrypt.hash('member123', 10);

    await this.userRepository.save([
      this.userRepository.create({ username: 'admin', password: adminPassword, name: '管理员', role: 'admin', phone: '13800000001' }),
      this.userRepository.create({ username: 'safety1', password: safetyPassword, name: '张安全', role: 'safety_officer', phone: '13800000002' }),
      this.userRepository.create({ username: 'member1', password: memberPassword, name: '李飞手', role: 'member', phone: '13800000003' }),
      this.userRepository.create({ username: 'member2', password: memberPassword, name: '王航模', role: 'member', phone: '13800000004' }),
      this.userRepository.create({ username: 'member3', password: memberPassword, name: '赵固定翼', role: 'member', phone: '13800000005' }),
    ]);

    await this.runwayRepository.save([
      this.runwayRepository.create({ name: '东跑道', code: 'RW-A', status: 'active', length: 200, width: 20, description: '固定翼主跑道' }),
      this.runwayRepository.create({ name: '西跑道', code: 'RW-B', status: 'active', length: 150, width: 15, description: '多旋翼起降区' }),
      this.runwayRepository.create({ name: '南跑道', code: 'RW-C', status: 'maintenance', length: 180, width: 18, description: '维护中' }),
    ]);

    const slots = [];
    for (let row = 1; row <= 4; row++) {
      for (let col = 1; col <= 6; col++) {
        slots.push(this.hangarSlotRepository.create({
          code: `H${row}-${col}`,
          row,
          column: col,
          status: 'available',
        }));
      }
    }
    await this.hangarSlotRepository.save(slots);

    console.log('Seed data initialized successfully');
  }
}
