import { IsString, IsOptional, IsNumber } from 'class-validator';

export class UpdateBookingDto {
  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsNumber()
  reviewedById?: number;

  @IsOptional()
  @IsString()
  reviewNote?: string;
}
