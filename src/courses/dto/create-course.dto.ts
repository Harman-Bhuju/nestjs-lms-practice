import { Transform } from "class-transformer";
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { Level } from "../enum/course.enum";
import { ApiProperty } from "@nestjs/swagger";


export class CreateCourseDto {

    @ApiProperty({
        example: "NestJs Advanced Course",
        description: "Name of the course",
    })
    @Transform(({ value }) =>
    value.trim().charAt(0).toUpperCase() +
    value.trim().slice(1).toLowerCase()
    )
    @IsNotEmpty()
    @IsString()
    name!: string;

    @ApiProperty({
        example: "This is the best course available out there",
        description: "Description of the course",
    })
    @Transform(({ value }) => value.trim())
    @IsNotEmpty()
    @IsString()
    description!: string;

    @ApiProperty({
        example: Level.BEGINNER,
        description: "Difficulty Level of the Course",
        enum: Level,
    })
    @Transform(({ value }) => value.trim().toLowerCase())
    @IsOptional()
    @IsEnum(Level)
    level!:Level;
    
    @ApiProperty({
        example: 1000,
        description: "Price of the course",
    })
    @IsNotEmpty()
    @IsNumber()
    price!:number;
    

}
