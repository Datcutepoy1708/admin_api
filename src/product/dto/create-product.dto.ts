import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  slug?: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsBoolean()
  @IsOptional()
  status?: boolean;

  @IsString()
  @IsNotEmpty()
  thumbnail: string;

  @IsNumber()
  @IsOptional()
  categoryId?: number;

  @IsArray()
  @IsNumber({}, { each: true })
  @IsOptional()
  technologyIds?: number[];
}
