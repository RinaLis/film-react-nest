
import { Test, TestingModule } from '@nestjs/testing';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import {
  CreateOrderDTO,
  OrderDTO,
} from './dto/order.dto';
import { ItemsListResponse } from 'src/films/types';

describe('OrderController', () => {
  let controller: OrderController;
  let service: OrderService;

  const mockOrderService = {
    create: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrderController],
      providers: [
        {
          provide: OrderService,
          useValue: mockOrderService,
        },
      ],
    }).compile();

    controller = module.get<OrderController>(OrderController);
    service = module.get<OrderService>(OrderService);
  });

  describe('create', () => {
    it('вызывает метод сервиса и возвращает сделанный заказ', async () => {
      const orders: CreateOrderDTO = {
        email: 'test@test.ru',
        phone: '79999999999',
        tickets: [
            {
            film: '1',
            session: '1',
            row: 1,
            seat: 1,
            },
        ]
    };

      const expectedResponse: ItemsListResponse<OrderDTO> = {
        total: 1000,
        items: [
          {
            id: '1',
            film: '1',
            session: '1',
            daytime: '10:00',
            row: 1,
            seat: 1,
            price: 500,
          },
        ],
      };

      mockOrderService.create.mockResolvedValue(expectedResponse);

      const result = await controller.create(orders);

      expect(service.create).toHaveBeenCalledWith(orders);
      expect(result).toEqual(expectedResponse);
    });
  });
});