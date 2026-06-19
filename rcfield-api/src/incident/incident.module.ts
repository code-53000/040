import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IncidentController } from './incident.controller';
import { IncidentService } from './incident.service';
import { Incident } from '../entities/incident.entity';
import { FlightRecord } from '../entities/flight-record.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Incident, FlightRecord])],
  controllers: [IncidentController],
  providers: [IncidentService],
  exports: [IncidentService],
})
export class IncidentModule {}
