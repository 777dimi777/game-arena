import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { Tournament } from '../../tournament/entities/tournament.entity';
import { Team } from '../../team/entities/team.entity';

export enum MatchStatus {
  SCHEDULED = 'SCHEDULED',
  LIVE = 'LIVE',
  FINISHED = 'FINISHED',
  CANCELLED = 'CANCELLED',
}

@Entity()
export class Match {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({
    type: 'timestamp',
    nullable: true,
  })
  scheduledAt?: Date;

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
  winner?: Team | null;

  @Column({
    type: 'enum',
    enum: MatchStatus,
    default: MatchStatus.SCHEDULED,
  })
  status!: MatchStatus;
}