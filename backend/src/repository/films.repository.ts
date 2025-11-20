import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { FilmDTO } from '../films/dto/films.dto';
import { Film } from '../films/schema/film.schema';

@Injectable()
export class FilmsRepository {
  constructor(@InjectModel(Film.name) private filmModel: Model<Film>) {}

  private toFilmDto(film: Film & { _id: any }): FilmDTO {
    return {
      id: film._id,
      rating: film.rating,
      director: film.director,
      tags: film.tags,
      image: film.image,
      cover: film.cover,
      title: film.title,
      about: film.about,
      description: film.description,
      schedule: film.schedule,
    };
  }

  async findAllFilms(): Promise<FilmDTO[]> {
    const films = await this.filmModel.find().exec();
    return films.map((film) => this.toFilmDto(film));
  }

  async findFilmById(id: string): Promise<FilmDTO> {
    const film = await this.filmModel.findById(id).exec();
    if (!film) {
      return null;
    }
    return this.toFilmDto(film);
  }

  async updateFilm(filmId: string, updateData: Partial<Film>): Promise<Film> {
    return this.filmModel
      .findByIdAndUpdate(filmId, updateData, { new: true })
      .exec();
  }
}
