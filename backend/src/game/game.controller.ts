import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { GameService } from './game.service';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';

@Controller('game')
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN')
  @Post()
  create(@Body() createGameDto: CreateGameDto) {
    return this.gameService.create(createGameDto);
  }

  @Get()
  findAll() {
    return this.gameService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.gameService.findOne(+id);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN')
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateGameDto: UpdateGameDto) {
    return this.gameService.update(+id, updateGameDto);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.gameService.remove(+id);
  }
}