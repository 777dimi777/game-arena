import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { Tournament } from '../../tournament/entities/tournament.entity';
import { Team } from '../../team/entities/team.entity';

@Entity()
export class Match {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  scheduledAt!: string;

  @Column({ default: 0 })
  scoreA!: number;

  @Column({ default: 0 })
  scoreB!: number;

  @ManyToOne(() => Tournament, { eager: true })
  tournament!: Tournament;

  @ManyToOne(() => Team, { eager: true })
  teamA!: Team;

  @ManyToOne(() => Team, { eager: true })
  teamB!: Team;

  @ManyToOne(() => Team, { eager: true, nullable: true })
  winner?: Team;
}