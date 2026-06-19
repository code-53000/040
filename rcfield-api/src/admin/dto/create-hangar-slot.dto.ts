import { IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateHangarSlotDto {
  @IsString()
  code: string;

  @IsNumber()
  row: number;

  @IsNumber()
  column: number;

  @IsOptional()
  @IsString()
  status?: string;
}
