import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { User } from './user.entity';
import { HangarSlot } from './hangar-slot.entity';

@Entity('aircraft')
export class Aircraft {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  type: string;

  @Column({ nullable: true })
  frequency: number;

  @ManyToOne(() => User, user => user.aircraft)
  member: User;

  @Column()
  memberId: number;

  @ManyToOne(() => HangarSlot, slot => slot.aircraft, { nullable: true })
  hangarSlot: HangarSlot;

  @Column({ nullable: true })
  hangarSlotId: number;

  @Column({ default: 'active' })
  status: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
