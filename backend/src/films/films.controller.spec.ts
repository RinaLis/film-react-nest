import { Test, TestingModule } from '@nestjs/testing';
import { FilmsController } from './films.controller';
import { FilmsService } from './films.service';
import { FilmDTO, ScheduleDTO } from './dto/films.dto';
import { ItemsListResponse } from './types';

describe('FilmsController', () => {
  let controller: FilmsController;
  let service: FilmsService;

  const mockFilmsService = {
    findAllFilms: jest.fn(),
    getFilmScheduleById: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FilmsController],
      providers: [
        {
          provide: FilmsService,
          useValue: mockFilmsService,
        },
      ],
    }).compile();

    controller = module.get<FilmsController>(FilmsController);
    service = module.get<FilmsService>(FilmsService);
  });

  describe('findAllFilms', () => {
    it('вызывает метод сервиса и возвращает список фильмов', async () => {
      const expectedFilms: ItemsListResponse<FilmDTO> = {
        total: 2,
        items: [
          {
            id: '1',
            title: 'Film-1',
            rating: 5.0,
            director: 'Director-1',
            tags: 'action',
            about: 'About-1',
            description: 'Description-1',
            image: 'image-1.jpg',
            cover: 'cover-1.jpg',
          },
          {
            id: '2',
            title: 'Film-2',
            rating: 7.0,
            director: 'Director-2',
            tags: 'comedy',
            about: 'About-2',
            description: 'Description-2',
            image: 'image-2.jpg',
            cover: 'cover-2.jpg',
          },
        ],
      };

      mockFilmsService.findAllFilms.mockResolvedValue(expectedFilms);

      const result = await controller.findAllFilms();

      expect(service.findAllFilms).toHaveBeenCalled();
      expect(result).toEqual(expectedFilms);
    });
  });

  describe('getFilmScheduleById', () => {
    it('вызывает метод сервиса и возвращает расписание фильма по ID', async () => {
      const filmId = '1';
      const expectedSchedule: ItemsListResponse<ScheduleDTO> = {
        total: 1,
        items: [
          {
            id: '1',
            daytime: '10:00',
            hall: 1,
            rows: 1,
            seats: 1,
            price: 350,
            taken: 'A1, A2',
          },
        ],
      };

      mockFilmsService.getFilmScheduleById.mockResolvedValue(expectedSchedule);

      const result = await controller.getFilmScheduleById(filmId);

      expect(service.getFilmScheduleById).toHaveBeenCalledWith(filmId);
      expect(result).toEqual(expectedSchedule);
    });
  });
});