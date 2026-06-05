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
    let valorant = await this.gameRepository.findOne({
      where: { name: 'Valorant' },
    });

    if (!valorant) {
      valorant = await this.gameRepository.save({
        name: 'Valorant',
        genre: 'Tactical FPS',
        teamSize: 5,
        imageUrl: 'valorant.jpg',
      });
    }

    let cs2 = await this.gameRepository.findOne({
      where: { name: 'Counter-Strike 2' },
    });

    if (!cs2) {
      cs2 = await this.gameRepository.save({
        name: 'Counter-Strike 2',
        genre: 'FPS',
        teamSize: 5,
        imageUrl: 'cs2.jpg',
      });
    }

    let fortnite = await this.gameRepository.findOne({
      where: { name: 'Fortnite' },
    });

    if (!fortnite) {
      fortnite = await this.gameRepository.save({
        name: 'Fortnite',
        genre: 'Battle Royale',
        teamSize: 1,
        imageUrl: 'fortnite.jpg',
      });
    }

    let balkanWarriors = await this.teamRepository.findOne({
      where: { name: 'Balkan Warriors' },
    });

    if (!balkanWarriors) {
      balkanWarriors = await this.teamRepository.save({
        name: 'Balkan Warriors',
        tag: 'BW',
        logoUrl: 'bw.jpg',
        description: 'Competitive Valorant team from Serbia',
      });
    }

    let nisEsports = await this.teamRepository.findOne({
      where: { name: 'Nis Esports' },
    });

    if (!nisEsports) {
      nisEsports = await this.teamRepository.save({
        name: 'Nis Esports',
        tag: 'NIS',
        logoUrl: 'nis.jpg',
        description: 'Gaming team from Nis',
      });
    }

    let tournament = await this.tournamentRepository.findOne({
      where: { name: 'Valorant Balkan Cup' },
    });

    if (!tournament) {
      tournament = await this.tournamentRepository.save({
        name: 'Valorant Balkan Cup',
        description: '5v5 tournament for Valorant teams',
        startDate: '2026-06-15',
        maxTeams: 16,
        prizePool: 500,
        status: 'OPEN',
        game: valorant,
        teams: [balkanWarriors, nisEsports],
      });
    }

    let match = await this.matchRepository.findOne({
      where: {
        tournament: { id: tournament.id },
        teamA: { id: balkanWarriors.id },
        teamB: { id: nisEsports.id },
      },
    });

    if (!match) {
      match = await this.matchRepository.save({
        scheduledAt: '2026-06-15 18:00',
        tournament: tournament,
        teamA: balkanWarriors,
        teamB: nisEsports,
        scoreA: 13,
        scoreB: 8,
        winner: balkanWarriors,
      });
    }

    return {
      message: 'Seed data ready',
      games: {
        valorant: valorant.id,
        cs2: cs2.id,
        fortnite: fortnite.id,
      },
      teams: {
        balkanWarriors: balkanWarriors.id,
        nisEsports: nisEsports.id,
      },
      tournament: tournament.id,
      match: match.id,
    };
  }
}