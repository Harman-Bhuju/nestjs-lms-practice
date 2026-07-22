import { ApiProperty } from '@nestjs/swagger';
import { Level } from '../enum/course.enum';

export class CourseResponseDto {
  @ApiProperty({
    example: 1,
    description: 'Unique ID of the course',
  })
  id!: number;

  @ApiProperty({
    example: 'NestJS Advanced Course',
    description: 'Name of the course',
  })
  name!: string;

  @ApiProperty({
    example: 'This is the best course available out there',
    description: 'Description of the course',
  })
  description!: string;

  @ApiProperty({
    enum: Level,
    example: Level.BEGINNER,
    description: 'Difficulty level of the course',
  })
  level!: Level;

  @ApiProperty({
    example: 1000,
    description: 'Price of the course',
  })
  price!: number;

  @ApiProperty({
    example: 1,
    description: 'ID of the user who created the course',
  })
  createdBy!: number;

  @ApiProperty({
    example: '2026-07-22T10:30:00.000Z',
    description: 'Date when the course was created',
  })
  createdAt!: Date;
}