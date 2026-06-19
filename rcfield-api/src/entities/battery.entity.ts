import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { User } from './user.entity';
import { HangarSlot } from './hangar-slot.entity';

@Entity('batteries')
export class Battery {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  capacity: number;

  @Column({ nullable: true })
  cellCount: number;

  @ManyToOne(() => User, user => user.batteries)
  member: User;

  @Column()
  memberId: number;

  @ManyToOne(() => HangarSlot, slot => slot.batteries, { nullable: true })
  hangarSlot: HangarSlot;

  @Column({ nullable: true })
  hangarSlotId: number;

  @Column({ default: 'active' })
  status: string;

  @Column({ default: 0 })
  chargeCycles: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
