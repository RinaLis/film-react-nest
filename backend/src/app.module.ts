import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as path from 'path';

import { FilmsModule } from './films/films.module';
import { OrderModule } from './order/order.module';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Film } from './films/entity/film.entity';
import { Schedule } from './films/entity/schedule.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) =>
        ({
          type: config.get<string>('DATABASE_DRIVER') || 'postgres',
          host: '127.0.0.1',
          port: config.get<number>('DATABASE_PORT') || 5432,
          username: config.get<string>('DATABASE_USER') || 'ypstudent',
          password: config.get<string>('DATABASE_PASSWORD') || 'YPstudent',
          database: config.get<string>('DATABASE_NAME') || 'prac',
          entities: [Film, Schedule],
          synchronize: false,
        }) as TypeOrmModuleOptions,
    }),

    ServeStaticModule.forRoot({
      rootPath: path.join(__dirname, '..', 'public', 'content', 'afisha'),
      serveRoot: '/content/afisha',
    }),

    FilmsModule,
    OrderModule,
  ],
})
export class AppModule {}
