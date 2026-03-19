import { IsBoolean, IsNotEmpty } from 'class-validator';

export class CreateTechnologyDto {
  @IsNotEmpty()
  name: string;

  @IsBoolean()
  status?: boolean;
}
