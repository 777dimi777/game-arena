import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SeedService } from './seed.service';
import { SeedController } from './seed.controller';
import { Game } from '../game/entities/game.entity';
import { Team } from '../team/entities/team.entity';
import { Tournament } from '../tournament/entities/tournament.entity';
import { Match } from '../match/entities/match.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Game, Team, Tournament, Match])],
  controllers: [SeedController],
  providers: [SeedService],
})
export class SeedModule {}