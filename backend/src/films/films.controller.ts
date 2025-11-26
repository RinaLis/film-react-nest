import { Controller, Get, Param } from '@nestjs/common';

import { FilmsService } from './films.service';
import { FilmDTO, ScheduleDTO } from './dto/films.dto';
import { ItemsListResponse } from './types';

@Controller('films')
export class FilmsController {
  constructor(private readonly filmsService: FilmsService) {}

  @Get()
  async findAllFilms(): Promise<ItemsListResponse<FilmDTO>> {
    return this.filmsService.findAllFilms();
  }

  @Get(':id/schedule')
  async getFilmScheduleById(
    @Param('id') id: string,
  ): Promise<ItemsListResponse<ScheduleDTO>> {
    return this.filmsService.getFilmScheduleById(id);
  }
}
