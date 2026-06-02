import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Game } from '../../game/entities/game.entity';

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
}