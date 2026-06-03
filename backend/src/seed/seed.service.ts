import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Game } from '../game/entities/game.entity';
import { Team } from '../team/entities/team.entity';
import { Tournament } from '../tournament/entities/tournament.entity';
import { Match } from '../match/entities/match.entity';

@Injectable()
export class SeedService {
  constructor(
    @InjectRepository(Game)
    private readonly gameRepository: Repository<Game>,

    @InjectRepository(Team)
    private readonly teamRepository: Repository<Team>,

    @InjectRepository(Tournament)
    private readonly tournamentRepository: Repository<Tournament>,

    @InjectRepository(Match)
    private readonly matchRepository: Repository<Match>,
  ) {}

  async seed() {
    const valorant = await this.gameRepository.save({
      name: 'Valorant',
      genre: 'Tactical FPS',
      teamSize: 5,
      imageUrl: 'valorant.jpg',
    });

    await this.gameRepository.save({
      name: 'Counter-Strike 2',
      genre: 'FPS',
      teamSize: 5,
      imageUrl: 'cs2.jpg',
    });

    await this.gameRepository.save({
      name: 'Fortnite',
      genre: 'Battle Royale',
      teamSize: 1,
      imageUrl: 'fortnite.jpg',
    });

    const balkanWarriors = await this.teamRepository.save({
      name: 'Balkan Warriors',
      tag: 'BW',
      logoUrl: 'bw.jpg',
      description: 'Competitive Valorant team from Serbia',
    });

    const nisEsports = await this.teamRepository.save({
      name: 'Nis Esports',
      tag: 'NIS',
      logoUrl: 'nis.jpg',
      description: 'Gaming team from Nis',
    });

    const tournament = await this.tournamentRepository.save({
      name: 'Valorant Balkan Cup',
      description: '5v5 tournament for Valorant teams',
      startDate: '2026-06-15',
      maxTeams: 16,
      prizePool: 500,
      status: 'OPEN',
      game: valorant,
      teams: [balkanWarriors, nisEsports],
    });

    const match = await this.matchRepository.save({
      scheduledAt: '2026-06-15 18:00',
      tournament: tournament,
      teamA: balkanWarriors,
      teamB: nisEsports,
      scoreA: 13,
      scoreB: 8,
      winner: balkanWarriors,
    });

    return {
      message: 'Seed data inserted successfully',
      games: 3,
      teams: 2,
      tournaments: 1,
      matches: 1,
      sampleMatchId: match.id,
    };
  }
}