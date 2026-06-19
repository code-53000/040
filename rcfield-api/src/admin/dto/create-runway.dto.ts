import { IsString, IsOptional, IsNumber } from 'class-validator';

export class CreateRunwayDto {
  @IsString()
  name: string;

  @IsString()
  code: string;

  @IsOptional()
  @IsNumber()
  length?: number;

  @IsOptional()
  @IsNumber()
  width?: number;

  @IsOptional()
  @IsString()
  description?: string;
}
