import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { Game } from '../game/entities/game.entity';
import { Team } from '../team/entities/team.entity';
import { Tournament } from '../tournament/entities/tournament.entity';
import { Match, MatchStatus } from '../match/entities/match.entity';
import { User } from '../user/entities/user.entity';

@Injectable()
export class SeedService {
  constructor(
    @InjectRepository(Game) private readonly gameRepository: Repository<Game>,
    @InjectRepository(Team) private readonly teamRepository: Repository<Team>,
    @InjectRepository(Tournament) private readonly tournamentRepository: Repository<Tournament>,
    @InjectRepository(Match) private readonly matchRepository: Repository<Match>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async seed() {
    const [admin, dimitrije, marko, ana, nikola, milica] = await Promise.all([
      this.ensureUser('admin2@test.com', 'Admin User', 'admin123', 'ADMIN'),
      this.ensureUser('jwtuser@test.com', 'Dimitrije', '123456', 'USER'),
      this.ensureUser('marko@test.com', 'Marko', '123456', 'USER'),
      this.ensureUser('ana@test.com', 'Ana', '123456', 'USER'),
      this.ensureUser('nikola@test.com', 'Nikola', '123456', 'USER'),
      this.ensureUser('milica@test.com', 'Milica', '123456', 'USER'),
    ]);

    const [valorant, cs2, leagueOfLegends, rocketLeague, fc26] = await Promise.all([
      this.ensureGame('Valorant', 'Tactical FPS', 5, 'valorant.jpg'),
      this.ensureGame('Counter-Strike 2', 'FPS', 5, 'cs2.jpg'),
      this.ensureGame('League of Legends', 'MOBA', 5, 'lol.jpg'),
      this.ensureGame('Rocket League', 'Sports', 3, 'rocket-league.jpg'),
      this.ensureGame('EA SPORTS FC 26', 'Sports', 1, 'fc26.jpg'),
    ]);

    const [balkanWarriors, nisEsports, cyberWolves, adriaEagles, vortexFive, nextLevel, riftRaiders, atlasGaming, turboTitans, neonStrikers, blueRivals, kingsEleven] = await Promise.all([
      this.ensureTeam('Balkan Warriors', 'BW', 'Competitive Valorant roster from Serbia.', dimitrije),
      this.ensureTeam('Nis Esports', 'NIS', 'Community-focused team from Nis.', marko),
      this.ensureTeam('Cyber Wolves', 'CW', 'Five-player roster focused on tactical shooters.', ana),
      this.ensureTeam('Adria Eagles', 'AE', 'Adriatic esports collective with tournament experience.', nikola),
      this.ensureTeam('Vortex Five', 'V5', 'Fast-paced team competing across multiple titles.', milica),
      this.ensureTeam('Next Level', 'NL', 'Ambitious Counter-Strike team from Belgrade.', marko),
      this.ensureTeam('Rift Raiders', 'RR', 'League of Legends team built around coordinated play.', ana),
      this.ensureTeam('Atlas Gaming', 'AT', 'Strategy-first roster with an international player base.', nikola),
      this.ensureTeam('Turbo Titans', 'TT', 'Rocket League trio with a high-tempo playstyle.', milica),
      this.ensureTeam('Neon Strikers', 'NS', 'New Serbian roster preparing for its first major event.', dimitrije),
      this.ensureTeam('Blue Rivals', 'BR', 'Competitive football esports club.', marko),
      this.ensureTeam('Kings Eleven', 'K11', 'FC tournament specialists and former regional finalists.', ana),
    ]);

    const [valorantCup, cs2Masters, nexusCup, rocketClash, fcChampions] = await Promise.all([
      this.ensureTournament('Valorant Balkan Cup', 'Open 5v5 Valorant tournament for teams from the Balkan region.', '2026-10-18', 16, 750, 'OPEN', valorant, [balkanWarriors, nisEsports, cyberWolves, adriaEagles, vortexFive, neonStrikers]),
      this.ensureTournament('CS2 Adria Masters', 'Competitive Counter-Strike 2 event with group-stage and playoff matches.', '2026-11-08', 8, 1200, 'OPEN', cs2, [nisEsports, cyberWolves, nextLevel, atlasGaming, balkanWarriors]),
      this.ensureTournament('Nexus League Cup', 'League of Legends cup with a closed registration phase.', '2026-09-26', 8, 1000, 'CLOSED', leagueOfLegends, [riftRaiders, atlasGaming, vortexFive, adriaEagles, neonStrikers]),
      this.ensureTournament('Rocket League Weekend Clash', 'Open 3v3 Rocket League weekend competition.', '2026-10-04', 8, 400, 'OPEN', rocketLeague, [turboTitans, neonStrikers, blueRivals, vortexFive]),
      this.ensureTournament('FC Champions Night', 'Completed EA SPORTS FC 26 tournament with a published winner.', '2026-08-22', 4, 300, 'FINISHED', fc26, [blueRivals, kingsEleven, nisEsports, nextLevel]),
    ]);

    await Promise.all([
      this.ensureMatch(valorantCup, balkanWarriors, nisEsports, '2026-10-18T18:00:00Z', 13, 8, MatchStatus.FINISHED, balkanWarriors),
      this.ensureMatch(valorantCup, cyberWolves, adriaEagles, '2026-10-18T20:00:00Z', 7, 5, MatchStatus.LIVE),
      this.ensureMatch(valorantCup, vortexFive, neonStrikers, '2026-10-19T17:00:00Z', 0, 0, MatchStatus.SCHEDULED),
      this.ensureMatch(cs2Masters, nextLevel, atlasGaming, '2026-11-08T16:00:00Z', 0, 0, MatchStatus.SCHEDULED),
      this.ensureMatch(cs2Masters, nisEsports, cyberWolves, '2026-11-08T19:00:00Z', 0, 0, MatchStatus.SCHEDULED),
      this.ensureMatch(nexusCup, riftRaiders, atlasGaming, '2026-09-26T18:00:00Z', 2, 1, MatchStatus.FINISHED, riftRaiders),
      this.ensureMatch(nexusCup, vortexFive, adriaEagles, '2026-09-26T21:00:00Z', 0, 0, MatchStatus.SCHEDULED),
      this.ensureMatch(rocketClash, turboTitans, blueRivals, '2026-10-04T15:00:00Z', 0, 0, MatchStatus.SCHEDULED),
      this.ensureMatch(fcChampions, kingsEleven, blueRivals, '2026-08-22T20:00:00Z', 4, 2, MatchStatus.FINISHED, kingsEleven),
      this.ensureMatch(fcChampions, nisEsports, nextLevel, '2026-08-22T18:00:00Z', 3, 1, MatchStatus.FINISHED, nisEsports),
    ]);

    return {
      message: 'Demo data ready',
      counts: { users: 6, games: 5, teams: 12, tournaments: 5, matches: 10 },
      demoAccounts: {
        administrator: { email: admin.email, password: 'admin123' },
        regularUser: { email: dimitrije.email, password: '123456' },
      },
    };
  }

  private async ensureGame(name: string, genre: string, teamSize: number, imageUrl: string): Promise<Game> {
    const existing = await this.gameRepository.findOne({ where: { name } });
    return this.gameRepository.save({ ...(existing ?? {}), name, genre, teamSize, imageUrl });
  }

  private async ensureTeam(name: string, tag: string, description: string, owner: User): Promise<Team> {
    const existing = await this.teamRepository.findOne({ where: { name } });
    return this.teamRepository.save({ ...(existing ?? {}), name, tag, description, owner });
  }

  private async ensureTournament(name: string, description: string, startDate: string, maxTeams: number, prizePool: number, status: string, game: Game, teams: Team[]): Promise<Tournament> {
    const existing = await this.tournamentRepository.findOne({ where: { name } });
    return this.tournamentRepository.save({ ...(existing ?? {}), name, description, startDate, maxTeams, prizePool, status, game, teams });
  }

  private async ensureMatch(tournament: Tournament, teamA: Team, teamB: Team, scheduledAt: string, scoreA: number, scoreB: number, status: MatchStatus, winner: Team | null = null): Promise<Match> {
    const existing = await this.matchRepository.findOne({
      where: { tournament: { id: tournament.id }, teamA: { id: teamA.id }, teamB: { id: teamB.id } },
    });
    return this.matchRepository.save({ ...(existing ?? {}), tournament, teamA, teamB, scheduledAt: new Date(scheduledAt), scoreA, scoreB, status, winner });
  }

  private async ensureUser(email: string, username: string, password: string, role: string): Promise<User> {
    const existingUser = await this.userRepository.createQueryBuilder('user').addSelect('user.password').where('user.email = :email', { email }).getOne();
    if (existingUser) return existingUser;
    return this.userRepository.save({ email, username, password: await bcrypt.hash(password, 10), role });
  }
}
