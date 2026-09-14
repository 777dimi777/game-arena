import { Test, TestingModule } from '@nestjs/testing';
import { TournamentService } from './tournament.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Game } from '../game/entities/game.entity';
import { Match } from '../match/entities/match.entity';
import { Team } from '../team/entities/team.entity';
import { Tournament } from './entities/tournament.entity';

describe('TournamentService', () => {
  let service: TournamentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TournamentService,
        { provide: getRepositoryToken(Tournament), useValue: {} },
        { provide: getRepositoryToken(Game), useValue: {} },
        { provide: getRepositoryToken(Team), useValue: {} },
        { provide: getRepositoryToken(Match), useValue: {} },
      ],
    }).compile();

    service = module.get<TournamentService>(TournamentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
