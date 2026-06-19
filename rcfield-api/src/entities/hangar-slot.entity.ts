import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany } from 'typeorm';
import { User } from './user.entity';
import { Aircraft } from './aircraft.entity';
import { Battery } from './battery.entity';

@Entity('hangar_slots')
export class HangarSlot {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  code: string;

  @Column()
  row: number;

  @Column()
  column: number;

  @Column({ default: 'available' })
  status: string;

  @ManyToOne(() => User, user => user.id, { nullable: true })
  member: User;

  @Column({ nullable: true })
  memberId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Aircraft, aircraft => aircraft.hangarSlot)
  aircraft: Aircraft[];

  @OneToMany(() => Battery, battery => battery.hangarSlot)
  batteries: Battery[];
}
