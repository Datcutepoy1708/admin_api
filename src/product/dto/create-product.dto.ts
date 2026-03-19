import { IsArray, IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateProductDto {
    @IsNotEmpty()
    title: string

    @IsNotEmpty()
    description: string

    @IsBoolean()
    status: boolean

    @IsString()
    @IsNotEmpty()
    thumbnail: string
    
   @IsNotEmpty()
   category:string

    @IsOptional()
    @IsArray()
    @IsNumber({}, { each: true })
    technologyIds?: number[];
}
