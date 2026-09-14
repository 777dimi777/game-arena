import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { MatchService } from './match.service';
import { CreateMatchDto } from './dto/create-match.dto';
import { UpdateMatchDto } from './dto/update-match.dto';
import { UpdateMatchResultDto } from './dto/update-match-result.dto';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';

@Controller('match')
export class MatchController {
  constructor(private readonly matchService: MatchService) {}

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN')
  @Post()
  create(@Body() createMatchDto: CreateMatchDto) {
    return this.matchService.create(createMatchDto);
  }
    @Get()
  findAll() {
    return this.matchService.findAll();
  }
  @Get('tournament/:tournamentId')
  findByTournament(@Param('tournamentId', ParseIntPipe) tournamentId: number) {
    return this.matchService.findByTournament(tournamentId);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.matchService.findOne(id);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN')
  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateMatchDto: UpdateMatchDto) {
    return this.matchService.update(id, updateMatchDto);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN')
  @Patch(':id/result')
  updateResult(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateMatchResultDto,
  ) {
    return this.matchService.updateResult(id, body.scoreA, body.scoreB);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN')
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.matchService.remove(id);
  }
}
