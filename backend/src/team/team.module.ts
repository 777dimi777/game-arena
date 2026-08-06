import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Match } from '../match/entities/match.entity';
import { User } from '../user/entities/user.entity';
import { Team } from './entities/team.entity';
import { TeamController } from './team.controller';
import { TeamService } from './team.service';

@Module({
  imports: [TypeOrmModule.forFeature([Team, Match, User])],
  controllers: [TeamController],
  providers: [TeamService],
})
export class TeamModule {}
