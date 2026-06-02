import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateTournamentDto } from './dto/create-tournament.dto';
import { UpdateTournamentDto } from './dto/update-tournament.dto';
import { Tournament } from './entities/tournament.entity';
import { Game } from '../game/entities/game.entity';

@Injectable()
export class TournamentService {
  constructor(
    @InjectRepository(Tournament)
    private readonly tournamentRepository: Repository<Tournament>,

    @InjectRepository(Game)
    private readonly gameRepository: Repository<Game>,
  ) {}

  async create(createTournamentDto: CreateTournamentDto) {
    const game = await this.gameRepository.findOne({
      where: { id: createTournamentDto.gameId },
    });

    if (!game) {
      throw new NotFoundException('Game not found');
    }

    const tournament = this.tournamentRepository.create({
      name: createTournamentDto.name,
      description: createTournamentDto.description,
      startDate: createTournamentDto.startDate,
      maxTeams: createTournamentDto.maxTeams,
      prizePool: createTournamentDto.prizePool,
      status: createTournamentDto.status ?? 'OPEN',
      game: game,
    });

    return this.tournamentRepository.save(tournament);
  }

  findAll() {
    return this.tournamentRepository.find();
  }

  async findOne(id: number) {
    const tournament = await this.tournamentRepository.findOne({
      where: { id },
    });

    if (!tournament) {
      throw new NotFoundException('Tournament not found');
    }

    return tournament;
  }

  async update(id: number, updateTournamentDto: UpdateTournamentDto) {
    const tournament = await this.findOne(id);

    if (updateTournamentDto.gameId) {
      const game = await this.gameRepository.findOne({
        where: { id: updateTournamentDto.gameId },
      });

      if (!game) {
        throw new NotFoundException('Game not found');
      }

      tournament.game = game;
    }

    Object.assign(tournament, {
      name: updateTournamentDto.name ?? tournament.name,
      description: updateTournamentDto.description ?? tournament.description,
      startDate: updateTournamentDto.startDate ?? tournament.startDate,
      maxTeams: updateTournamentDto.maxTeams ?? tournament.maxTeams,
      prizePool: updateTournamentDto.prizePool ?? tournament.prizePool,
      status: updateTournamentDto.status ?? tournament.status,
    });

    return this.tournamentRepository.save(tournament);
  }

  async remove(id: number) {
    const tournament = await this.findOne(id);
    return this.tournamentRepository.remove(tournament);
  }
}