import {
  Injectable,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { v4 as uuid } from 'uuid';

import { FilmsRepository } from '../repository/films.repository';
import { CreateOrderDTO } from './dto/order.dto';

@Injectable()
export class OrderService {
  constructor(private readonly filmsRepository: FilmsRepository) {}

  async create({ tickets }: CreateOrderDTO) {
    if (!tickets?.length) {
      throw new BadRequestException('Не добавлено ни одного билета');
    }

    const results = [];

    for (const ticket of tickets) {
      const filmId = ticket.film;
      const scheduleId = ticket.session;

      const film = await this.filmsRepository.findFilmById(filmId);
      if (!film)
        throw new BadRequestException(`Фильм с id ${filmId} не найден`);

      const schedule = film.schedule.find(
        (schedule) => schedule.id === scheduleId,
      );
      if (!schedule) {
        throw new BadRequestException(`Киносеанс с id ${scheduleId} не найден`);
      }

      const checkRow = ticket.row >= 1 && ticket.row <= schedule.rows;
      const checkSeat = ticket.seat >= 1 && ticket.seat <= schedule.seats;
      if (!checkRow || !checkSeat) {
        throw new BadRequestException(
          `Место с координатами ${ticket.row}:${ticket.seat} отсутствует`,
        );
      }

      const coords = `${ticket.row}:${ticket.seat}`;
      if (schedule.taken.includes(coords)) {
        throw new ConflictException(
          `Место с координатами ${coords} уже занято`,
        );
      }
      schedule.taken.push(coords);

      await this.filmsRepository.updateFilm(film.id, {
        schedule: film.schedule.map((schedule) =>
          schedule.id === scheduleId
            ? { ...schedule, taken: schedule.taken }
            : schedule,
        ),
      });

      results.push({
        id: uuid(),
        film: filmId,
        session: scheduleId,
        daytime: schedule.daytime,
        row: ticket.row,
        seat: ticket.seat,
        price: schedule.price,
      });
    }

    return {
      total: results.length,
      items: results,
    };
  }
}
