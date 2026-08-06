import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Match, MatchStatus } from '../match/entities/match.entity';
import { User } from '../user/entities/user.entity';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { Team } from './entities/team.entity';

@Injectable()
export class TeamService {
  constructor(
    @InjectRepository(Team)
    private readonly teamRepository: Repository<Team>,
    @InjectRepository(Match)
    private readonly matchRepository: Repository<Match>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createTeamDto: CreateTeamDto, ownerId: number) {
    const owner = await this.userRepository.findOne({ where: { id: ownerId } });

    if (!owner) {
      throw new NotFoundException('User not found');
    }

    const team = this.teamRepository.create({ ...createTeamDto, owner });
    return this.teamRepository.save(team);
  }

  findAll() {
    return this.teamRepository.find();
  }

  async findOne(id: number) {
    const team = await this.teamRepository.findOne({ where: { id } });

    if (!team) {
      throw new NotFoundException('Team not found');
    }

    return team;
  }

  async getTeamProfile(id: number) {
    const team = await this.findOne(id);
    const matches = await this.matchRepository
      .createQueryBuilder('match')
      .leftJoinAndSelect('match.tournament', 'tournament')
      .leftJoinAndSelect('tournament.game', 'game')
      .leftJoinAndSelect('match.teamA', 'teamA')
      .leftJoinAndSelect('match.teamB', 'teamB')
      .leftJoinAndSelect('match.winner', 'winner')
      .where('teamA.id = :id OR teamB.id = :id', { id })
      .orderBy('match.scheduledAt', 'DESC', 'NULLS LAST')
      .addOrderBy('match.id', 'DESC')
      .getMany();

    const playedMatches = matches.filter(
      (match) =>
        match.status === MatchStatus.FINISHED ||
        Boolean(match.winner) ||
        match.scoreA > 0 ||
        match.scoreB > 0,
    );
    const wins = playedMatches.filter(
      (match) => match.winner?.id === team.id,
    ).length;
    const losses = playedMatches.filter(
      (match) => Boolean(match.winner) && match.winner?.id !== team.id,
    ).length;
    const winRate = playedMatches.length
      ? Math.round((wins / playedMatches.length) * 100)
      : 0;
    const badges: string[] = [];

    if (wins >= 3) badges.push('Hot Streak');
    if (playedMatches.length >= 5) badges.push('Veteran');
    if (wins > 0 && losses === 0) badges.push('Undefeated');
    if (winRate >= 70 && playedMatches.length >= 3) badges.push('Elite Team');

    return {
      team,
      matches,
      playedMatches: playedMatches.length,
      wins,
      losses,
      winRate,
      badges,
    };
  }

  async update(id: number, updateTeamDto: UpdateTeamDto) {
    const team = await this.findOne(id);
    Object.assign(team, updateTeamDto);
    return this.teamRepository.save(team);
  }

  async remove(id: number) {
    const team = await this.findOne(id);
    return this.teamRepository.remove(team);
  }
}
