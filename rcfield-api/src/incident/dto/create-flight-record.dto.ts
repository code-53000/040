import { IsNumber, IsString, IsOptional, IsDateString } from 'class-validator';

export class CreateFlightRecordDto {
  @IsOptional()
  @IsNumber()
  bookingId?: number;

  @IsOptional()
  @IsString()
  actualStartTime?: string;

  @IsOptional()
  @IsString()
  actualEndTime?: string;

  @IsOptional()
  @IsString()
  weatherConditions?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
