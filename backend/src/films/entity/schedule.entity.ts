import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
  JoinColumn,
} from 'typeorm';
import { IsInt } from 'class-validator';
import { Film } from './film.entity';

@Entity('schedules')
export class Schedule {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  daytime: string;

  @Column()
  @IsInt()
  hall: number;

  @Column()
  @IsInt()
  rows: number;

  @Column()
  @IsInt()
  seats: number;

  @Column()
  price: number;

  @Column()
  taken: string;

  @Column({ type: 'uuid' })
  filmId: string;

  @ManyToOne(() => Film, (film) => film.schedule)
  @JoinColumn({ name: 'filmId' })
  film: Film;
}
