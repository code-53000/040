import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Aircraft } from './aircraft.entity';
import { Battery } from './battery.entity';
import { FlightBooking } from './flight-booking.entity';
import { FlightRecord } from './flight-record.entity';
import { Incident } from './incident.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @Column()
  name: string;

  @Column({ default: 'member' })
  role: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  email: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Aircraft, aircraft => aircraft.member)
  aircraft: Aircraft[];

  @OneToMany(() => Battery, battery => battery.member)
  batteries: Battery[];

  @OneToMany(() => FlightBooking, booking => booking.member)
  bookings: FlightBooking[];

  @OneToMany(() => FlightRecord, record => record.safetyOfficer)
  flightRecords: FlightRecord[];

  @OneToMany(() => Incident, incident => incident.reporter)
  reportedIncidents: Incident[];
}
