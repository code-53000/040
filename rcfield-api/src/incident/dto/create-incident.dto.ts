import { IsNumber, IsString, IsOptional } from 'class-validator';

export class CreateIncidentDto {
  @IsOptional()
  @IsNumber()
  flightRecordId?: number;

  @IsString()
  type: string;

  @IsString()
  severity: string;

  @IsString()
  description: string;
}
