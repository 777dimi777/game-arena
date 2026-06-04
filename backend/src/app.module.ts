import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GameModule } from './game/game.module';
import { TournamentModule } from './tournament/tournament.module';
import { TeamModule } from './team/team.module';
import { MatchModule } from './match/match.module';
import { SeedModule } from './seed/seed.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'game_arena',
      autoLoadEntities: true,
      synchronize: true,
    }),
    GameModule,
    TournamentModule,
    TeamModule,
    MatchModule,
    SeedModule,
    UserModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}