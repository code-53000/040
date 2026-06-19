import { IsNumber, IsString, IsOptional, IsDateString } from 'class-validator';

export class CreateBookingDto {
  @IsNumber()
  runwayId: number;

  @IsNumber()
  aircraftId: number;

  @IsDateString()
  date: string;

  @IsString()
  startTime: string;

  @IsString()
  endTime: string;

  @IsOptional()
  @IsNumber()
  frequency?: number;
}
