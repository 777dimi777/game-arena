import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { User } from '../../user/entities/user.entity';

@Entity()
export class Team {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column()
  tag!: string;

  @Column({ nullable: true })
  logoUrl?: string;

  @Column({ nullable: true })
  description?: string;

  @ManyToOne(() => User, { eager: true, nullable: true })
  owner?: User | null;
}
