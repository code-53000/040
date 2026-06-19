import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { FlightBooking } from './flight-booking.entity';

@Entity('runways')
export class Runway {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column({ unique: true })
  code: string;

  @Column({ default: 'active' })
  status: string;

  @Column({ nullable: true })
  length: number;

  @Column({ nullable: true })
  width: number;

  @Column({ nullable: true, type: 'text' })
  description: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => FlightBooking, booking => booking.runway)
  bookings: FlightBooking[];
}
