import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { User } from './user.entity';
import { FlightRecord } from './flight-record.entity';

@Entity('incidents')
export class Incident {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => FlightRecord, { nullable: true })
  flightRecord: FlightRecord;

  @Column({ nullable: true })
  flightRecordId: number;

  @Column()
  type: string;

  @Column()
  severity: string;

  @Column({ type: 'text' })
  description: string;

  @ManyToOne(() => User, user => user.reportedIncidents)
  reporter: User;

  @Column()
  reporterId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
