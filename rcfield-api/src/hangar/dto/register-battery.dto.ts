import { IsNumber, IsString, IsOptional } from 'class-validator';

export class RegisterBatteryDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsNumber()
  capacity?: number;

  @IsOptional()
  @IsNumber()
  cellCount?: number;

  @IsOptional()
  @IsNumber()
  hangarSlotId?: number;
}
