import { Injectable, NotFoundException } from '@nestjs/common';

import { FilmDTO, ScheduleDTO } from './dto/films.dto';
import { FilmsRepository } from '../repository/films.repository';
import { ItemsListResponse } from './types';

@Injectable()
export class FilmsService {
  constructor(private readonly filmsRepository: FilmsRepository) {}

  async findAllFilms(): Promise<ItemsListResponse<Omit<FilmDTO, 'schedule'>>> {
    const films = await this.filmsRepository.findAllFilms();
    return {
      total: films.length,
      items: films.map((film) => {
        delete film.schedule;
        return film;
      }),
    };
  }

  async getFilmScheduleById(
    id: string,
  ): Promise<ItemsListResponse<ScheduleDTO>> {
    const film = await this.filmsRepository.findFilmById(id);
    if (!film) {
      throw new NotFoundException(`Фильм с id ${id} не найден`);
    }
    const schedules = (film.schedule ?? []) as ScheduleDTO[];
    return {
      total: schedules.length,
      items: schedules,
    };
  }
}
