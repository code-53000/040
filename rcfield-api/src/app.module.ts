import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { FlightBookingModule } from './flight-booking/flight-booking.module';
import { HangarModule } from './hangar/hangar.module';
import { IncidentModule } from './incident/incident.module';
import { AdminModule } from './admin/admin.module';
import { ConflictCheckModule } from './conflict-check/conflict-check.module';
import { User } from './entities/user.entity';
import { Runway } from './entities/runway.entity';
import { HangarSlot } from './entities/hangar-slot.entity';
import { Aircraft } from './entities/aircraft.entity';
import { Battery } from './entities/battery.entity';
import { FlightBooking } from './entities/flight-booking.entity';
import { FlightRecord } from './entities/flight-record.entity';
import { Incident } from './entities/incident.entity';
import { SeedService } from './seed/seed.service';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT, 10) || 3306,
      username: process.env.DB_USERNAME || 'root',
      password: process.env.DB_PASSWORD || 'root',
      database: process.env.DB_DATABASE || 'rcfield',
      entities: [User, Runway, HangarSlot, Aircraft, Battery, FlightBooking, FlightRecord, Incident],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([User, Runway, HangarSlot, Aircraft, Battery, FlightBooking, FlightRecord, Incident]),
    AuthModule,
    FlightBookingModule,
    HangarModule,
    IncidentModule,
    AdminModule,
    ConflictCheckModule,
  ],
  controllers: [AppController],
  providers: [AppService, SeedService],
})
export class AppModule {}
