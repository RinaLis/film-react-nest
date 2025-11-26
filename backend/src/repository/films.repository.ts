import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { FilmDTO, ScheduleDTO } from '../films/dto/films.dto';
import { Film } from 'src/films/entity/film.entity';
import { Schedule } from 'src/films/entity/schedule.entity';

@Injectable()
export class FilmsRepository {
  constructor(
    @InjectRepository(Film)
    private filmRepository: Repository<Film>,
    @InjectRepository(Schedule)
    private scheduleRepository: Repository<Schedule>,
  ) {}

  private toFilmDto(film: Film): FilmDTO {
    return {
      id: film.id,
      rating: film.rating,
      director: film.director,
      tags: film.tags,
      image: film.image,
      cover: film.cover,
      title: film.title,
      about: film.about,
      description: film.description,
    };
  }

  private toScheduleDto(schedule: Schedule): ScheduleDTO {
    return {
      id: schedule.id,
      daytime: schedule.daytime,
      hall: schedule.hall,
      rows: schedule.rows,
      seats: schedule.seats,
      price: schedule.price,
      taken: schedule.taken,
    };
  }

  async findAllFilms(): Promise<FilmDTO[]> {
    const films = await this.filmRepository.find();
    return films.map((film) => this.toFilmDto(film));
  }

  async findFilmById(id: string): Promise<Film> {
    const film = await this.filmRepository.findOne({
      where: {
        id: id,
      },
      relations: {
        schedule: true,
      },
    });
    if (!film) {
      return null;
    }
    return film;
  }
  async findSchedulesByFilmId(filmId: string): Promise<ScheduleDTO[]> {
    const schedules = await this.scheduleRepository.find({
      where: { filmId },
    });
    return schedules.map((schedule) => this.toScheduleDto(schedule));
  }

  async updateSchedule(updateData: Partial<Schedule>) {
    this.scheduleRepository.save(updateData);
  }
}
