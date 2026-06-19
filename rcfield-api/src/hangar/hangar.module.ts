import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HangarController } from './hangar.controller';
import { HangarService } from './hangar.service';
import { HangarSlot } from '../entities/hangar-slot.entity';
import { Aircraft } from '../entities/aircraft.entity';
import { Battery } from '../entities/battery.entity';

@Module({
  imports: [TypeOrmModule.forFeature([HangarSlot, Aircraft, Battery])],
  controllers: [HangarController],
  providers: [HangarService],
  exports: [HangarService],
})
export class HangarModule {}
