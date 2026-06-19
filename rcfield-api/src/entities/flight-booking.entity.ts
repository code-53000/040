import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { User } from './user.entity';
import { Runway } from './runway.entity';
import { Aircraft } from './aircraft.entity';

@Entity('flight_bookings')
export class FlightBooking {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, user => user.bookings)
  member: User;

  @Column()
  memberId: number;

  @ManyToOne(() => Runway, runway => runway.bookings)
  runway: Runway;

  @Column()
  runwayId: number;

  @ManyToOne(() => Aircraft, { nullable: true })
  aircraft: Aircraft;

  @Column({ nullable: true })
  aircraftId: number;

  @Column({ type: 'date' })
  date: string;

  @Column()
  startTime: string;

  @Column()
  endTime: string;

  @Column({ nullable: true })
  frequency: number;

  @Column({ default: 'pending' })
  status: string;

  @ManyToOne(() => User, { nullable: true })
  reviewedBy: User;

  @Column({ nullable: true })
  reviewedById: number;

  @Column({ nullable: true, type: 'text' })
  reviewNote: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
