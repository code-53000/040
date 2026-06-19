import { IsNumber, IsString, IsOptional } from 'class-validator';

export class RegisterAircraftDto {
  @IsString()
  name: string;

  @IsString()
  type: string;

  @IsOptional()
  @IsNumber()
  frequency?: number;

  @IsOptional()
  @IsNumber()
  hangarSlotId?: number;
}
