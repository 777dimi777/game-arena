import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateMatchDto } from './dto/create-match.dto';
import { UpdateMatchDto } from './dto/update-match.dto';
import { Match } from './entities/match.entity';
import { Tournament } from '../tournament/entities/tournament.entity';
import { Team } from '../team/entities/team.entity';

@Injectable()
export class MatchService {
  constructor(
    @InjectRepository(Match)
    private readonly matchRepository: Repository<Match>,

    @InjectRepository(Tournament)
    private readonly tournamentRepository: Repository<Tournament>,

    @InjectRepository(Team)
    private readonly teamRepository: Repository<Team>,
  ) {}

  async create(createMatchDto: CreateMatchDto) {
    const tournament = await this.tournamentRepository.findOne({
      where: { id: createMatchDto.tournamentId },
    });

    if (!tournament) {
      throw new NotFoundException('Tournament not found');
    }

    const teamA = await this.teamRepository.findOne({
      where: { id: createMatchDto.teamAId },
    });

    if (!teamA) {
      throw new NotFoundException('Team A not found');
    }

    const teamB = await this.teamRepository.findOne({
      where: { id: createMatchDto.teamBId },
    });

    if (!teamB) {
      throw new NotFoundException('Team B not found');
    }

    const match = this.matchRepository.create({
      scheduledAt: createMatchDto.scheduledAt,
      tournament,
      teamA,
      teamB,
      scoreA: 0,
      scoreB: 0,
    });

    return this.matchRepository.save(match);
  }

  findAll() {
    return this.matchRepository.find();
  }

  async findOne(id: number) {
    const match = await this.matchRepository.findOne({
      where: { id },
    });

    if (!match) {
      throw new NotFoundException('Match not found');
    }

    return match;
  }

  async update(id: number, updateMatchDto: UpdateMatchDto) {
    const match = await this.findOne(id);

    if (updateMatchDto.tournamentId) {
      const tournament = await this.tournamentRepository.findOne({
        where: { id: updateMatchDto.tournamentId },
      });

      if (!tournament) {
        throw new NotFoundException('Tournament not found');
      }

      match.tournament = tournament;
    }

    if (updateMatchDto.teamAId) {
      const teamA = await this.teamRepository.findOne({
        where: { id: updateMatchDto.teamAId },
      });

      if (!teamA) {
        throw new NotFoundException('Team A not found');
      }

      match.teamA = teamA;
    }

    if (updateMatchDto.teamBId) {
      const teamB = await this.teamRepository.findOne({
        where: { id: updateMatchDto.teamBId },
      });

      if (!teamB) {
        throw new NotFoundException('Team B not found');
      }

      match.teamB = teamB;
    }

    if (updateMatchDto.winnerId) {
      const winner = await this.teamRepository.findOne({
        where: { id: updateMatchDto.winnerId },
      });

      if (!winner) {
        throw new NotFoundException('Winner team not found');
      }

      match.winner = winner;
    }

    if (updateMatchDto.scheduledAt !== undefined) {
      match.scheduledAt = updateMatchDto.scheduledAt;
    }

    if (updateMatchDto.scoreA !== undefined) {
      match.scoreA = updateMatchDto.scoreA;
    }

    if (updateMatchDto.scoreB !== undefined) {
      match.scoreB = updateMatchDto.scoreB;
    }

    return this.matchRepository.save(match);
  }
  async updateResult(id: number, scoreA: number, scoreB: number) {
  const match = await this.findOne(id);

  match.scoreA = scoreA;
  match.scoreB = scoreB;

  if (scoreA > scoreB) {
    match.winner = match.teamA;
  } else if (scoreB > scoreA) {
    match.winner = match.teamB;
  } else {
    match.winner = undefined;
  }

  return this.matchRepository.save(match);
}
  async remove(id: number) {
    const match = await this.findOne(id);
    return this.matchRepository.remove(match);
  }
}