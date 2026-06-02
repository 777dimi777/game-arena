import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MatchService } from './match.service';
import { MatchController } from './match.controller';
import { Match } from './entities/match.entity';
import { Tournament } from '../tournament/entities/tournament.entity';
import { Team } from '../team/entities/team.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Match, Tournament, Team])],
  controllers: [MatchController],
  providers: [MatchService],
})
export class MatchModule {}