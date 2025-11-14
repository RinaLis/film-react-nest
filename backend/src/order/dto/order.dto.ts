import {
  IsEmail,
  IsString,
  IsArray,
  ValidateNested,
  IsNumber,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export class TicketDTO {
  @IsString()
  film: string;

  @IsString()
  session: string;

  @IsNumber()
  @Min(1)
  row: number;

  @IsNumber()
  @Min(1)
  seat: number;
}

export class ContactsDTO {
  @IsEmail()
  email: string;

  @IsString()
  phone: string;
}

export class CreateOrderDTO extends ContactsDTO {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TicketDTO)
  tickets: TicketDTO[];
}
