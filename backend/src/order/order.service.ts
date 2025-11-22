import {
  Injectable,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';

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

      const schedules =
        await this.filmsRepository.findSchedulesByFilmId(filmId);
      if (!schedules)
        throw new BadRequestException(`Фильм с id ${filmId} не найден`);

      const schedule = schedules.find((schedule) => schedule.id === scheduleId);
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
      const taken = schedule.taken.split(',');

      const coords = `${ticket.row}:${ticket.seat}`;
      if (taken.includes(coords)) {
        throw new ConflictException(
          `Место с координатами ${coords} уже занято`,
        );
      }
      taken.push(coords);
      schedule.taken = taken.join(',');

      await this.filmsRepository.updateSchedule(schedule);

      results.push({
        id: `${filmId}-${scheduleId}-${ticket.row}-${ticket.seat}`,
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
