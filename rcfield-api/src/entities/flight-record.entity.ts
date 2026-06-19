import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';
import { User } from './user.entity';
import { FlightBooking } from './flight-booking.entity';

@Entity('flight_records')
export class FlightRecord {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => FlightBooking, { nullable: true })
  booking: FlightBooking;

  @Column({ nullable: true })
  bookingId: number;

  @Column({ nullable: true })
  actualStartTime: string;

  @Column({ nullable: true })
  actualEndTime: string;

  @ManyToOne(() => User, user => user.flightRecords)
  safetyOfficer: User;

  @Column({ nullable: true })
  safetyOfficerId: number;

  @Column({ nullable: true })
  weatherConditions: string;

  @Column({ nullable: true, type: 'text' })
  notes: string;

  @CreateDateColumn()
  createdAt: Date;
}
