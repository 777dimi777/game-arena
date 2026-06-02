import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Game } from '../../game/entities/game.entity';
import { Team } from '../../team/entities/team.entity';

@Entity()
export class Tournament {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column()
  description!: string;

  @Column()
  startDate!: string;

  @Column()
  maxTeams!: number;

  @Column()
  prizePool!: number;

  @Column({ default: 'OPEN' })
  status!: string;

  @ManyToOne(() => Game, { eager: true })
  game!: Game;

  @ManyToMany(() => Team, { eager: true })
  @JoinTable()
  teams!: Team[];
}