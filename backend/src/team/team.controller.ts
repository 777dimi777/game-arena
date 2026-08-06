import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { TeamService } from './team.service';

interface AuthenticatedRequest {
  user: {
    userId: number;
  };
}

@Controller('team')
export class TeamController {
  constructor(private readonly teamService: TeamService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  create(
    @Body() createTeamDto: CreateTeamDto,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.teamService.create(createTeamDto, request.user.userId);
  }

  @Get()
  findAll() {
    return this.teamService.findAll();
  }

  @Get(':id/profile')
  getProfile(@Param('id', ParseIntPipe) id: number) {
    return this.teamService.getTeamProfile(id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.teamService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTeamDto: UpdateTeamDto) {
    return this.teamService.update(+id, updateTeamDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.teamService.remove(+id);
  }
}
