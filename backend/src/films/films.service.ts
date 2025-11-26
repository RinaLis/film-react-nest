import { Injectable, NotFoundException } from '@nestjs/common';

import { FilmDTO, ScheduleDTO } from './dto/films.dto';
import { FilmsRepository } from '../repository/films.repository';
import { ItemsListResponse } from './types';

@Injectable()
export class FilmsService {
  constructor(private readonly filmsRepository: FilmsRepository) {}

  async findAllFilms(): Promise<ItemsListResponse<FilmDTO>> {
    const films = await this.filmsRepository.findAllFilms();
    return {
      total: films.length,
      items: films,
    };
  }

  async getFilmScheduleById(
    id: string,
  ): Promise<ItemsListResponse<ScheduleDTO>> {
    const schedules = await this.filmsRepository.findSchedulesByFilmId(id);
    if (!schedules) {
      throw new NotFoundException(`Фильм с id ${id} не найден`);
    }
    return {
      total: schedules.length,
      items: schedules,
    };
  }
}
