import { IsNotEmpty, IsOptional } from "class-validator";

export class CreateEmployeeDto {
    @IsNotEmpty()
    fullName: string

    @IsNotEmpty()
    role: string

    @IsOptional()
    image?: string
}
