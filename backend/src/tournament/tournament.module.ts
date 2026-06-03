import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TournamentService } from './tournament.service';
import { TournamentController } from './tournament.controller';
import { Tournament } from './entities/tournament.entity';
import { Game } from '../game/entities/game.entity';
import { Team } from '../team/entities/team.entity';
import { Match } from '../match/entities/match.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Tournament, Game, Team, Match])],
  controllers: [TournamentController],
  providers: [TournamentService],
})
export class TournamentModule {}