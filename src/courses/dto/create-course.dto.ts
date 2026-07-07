import { Transform } from "class-transformer";
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { Level } from "../enum/course.enum";


export class CreateCourseDto {

    @Transform(({ value }) =>
    value.trim().charAt(0).toUpperCase() +
    value.trim().slice(1).toLowerCase()
    )
    @IsNotEmpty()
    @IsString()
    name!: string;

    @Transform(({ value }) => value.trim())
    @IsNotEmpty()
    @IsString()
    description!: string;

    @Transform(({ value }) => value.trim().toLowerCase())
    @IsOptional()
    @IsEnum(Level)
    level!:Level;
    

    @IsNotEmpty()
    @IsNumber()
    price!:number;
    

}
