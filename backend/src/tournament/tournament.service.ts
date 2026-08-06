import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Match, MatchStatus } from '../match/entities/match.entity';
import { CreateTournamentDto } from './dto/create-tournament.dto';
import { UpdateTournamentDto } from './dto/update-tournament.dto';
import { Tournament } from './entities/tournament.entity';
import { Game } from '../game/entities/game.entity';
import { Team } from '../team/entities/team.entity';

@Injectable()
export class TournamentService {
  constructor(
    @InjectRepository(Tournament)
    private readonly tournamentRepository: Repository<Tournament>,

    @InjectRepository(Game)
    private readonly gameRepository: Repository<Game>,

    @InjectRepository(Team)
    private readonly teamRepository: Repository<Team>,
    @InjectRepository(Match)
    private readonly matchRepository: Repository<Match>,
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
      teams: [],
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

  async addTeam(tournamentId: number, teamId: number) {
    const tournament = await this.findOne(tournamentId);

    const team = await this.teamRepository.findOne({
      where: { id: teamId },
    });

    if (!team) {
      throw new NotFoundException('Team not found');
    }

    if (!tournament.teams) {
      tournament.teams = [];
    }

    const alreadyJoined = tournament.teams.some((t) => t.id === team.id);

    if (!alreadyJoined) {
      tournament.teams.push(team);
    }

    return this.tournamentRepository.save(tournament);
  }
async getLeaderboard(id: number) {
  const tournament = await this.tournamentRepository.findOne({
    where: { id },
    relations: {
      teams: true,
    },
  });

  if (!tournament) {
    throw new NotFoundException('Tournament not found');
  }

  const matches = await this.matchRepository.find({
    where: {
      tournament: {
        id,
      },
    },
    relations: {
      teamA: true,
      teamB: true,
      winner: true,
    },
  });

  const leaderboard = tournament.teams.map((team) => {
    const teamMatches = matches.filter(
      (match) =>
        match.teamA.id === team.id || match.teamB.id === team.id,
    );

    const finishedMatches = teamMatches.filter((match) => {
      const hasResult =
        match.scoreA !== null &&
        match.scoreA !== undefined &&
        match.scoreB !== null &&
        match.scoreB !== undefined &&
        (match.scoreA > 0 || match.scoreB > 0);

      return match.status === MatchStatus.FINISHED || !!match.winner || hasResult;
    });

    const wins = finishedMatches.filter(
      (match) => match.winner?.id === team.id,
    ).length;

    const losses = finishedMatches.filter(
      (match) => match.winner && match.winner.id !== team.id,
    ).length;

    const playedMatches = finishedMatches.length;

    const winRate =
      playedMatches > 0
        ? Math.round((wins / playedMatches) * 100)
        : 0;

    const points = wins * 3;

    return {
      teamId: team.id,
      teamName: team.name,
      tag: team.tag,
      playedMatches,
      wins,
      losses,
      winRate,
      points,
    };
  });

  return leaderboard.sort((a, b) => {
    if (b.points !== a.points) {
      return b.points - a.points;
    }

    if (b.winRate !== a.winRate) {
      return b.winRate - a.winRate;
    }

    return b.wins - a.wins;
  });
}
  async remove(id: number) {
    const tournament = await this.findOne(id);
    return this.tournamentRepository.remove(tournament);
  }
}
