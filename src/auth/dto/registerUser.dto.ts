import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  MaxLength,
  Matches,
} from 'class-validator';


export class RegisterDto {
  @ApiProperty({
    example: 'John',
    description: 'First name of the user',
  })
  @Transform(({ value }) => {
    if (typeof value !== 'string') return value;

    const trimmed = value.trim();

    return (
      trimmed.charAt(0).toUpperCase() +
      trimmed.slice(1).toLowerCase()
    );
  })
  @IsNotEmpty()
  @IsString()
  firstName!: string;

  @ApiProperty({
    example: 'Doe',
    description: 'Last name of the user',
  })
  @Transform(({ value }) => {
    if (typeof value !== 'string') return value;

    const trimmed = value.trim();

    return (
      trimmed.charAt(0).toUpperCase() +
      trimmed.slice(1).toLowerCase()
    );
  })
  @IsNotEmpty()
  @IsString()
  lastName!: string;

  @ApiProperty({
    example: 'johndoe@gmail.com',
    description: 'Email of the user',
  })
  @Transform(({ value }) =>
    typeof value === 'string' ? value.trim().toLowerCase() : value,
  )
  @IsNotEmpty()
  @IsEmail()
  email!: string;

  @ApiProperty({
    example: 'Password123.hello',
    description:
      'Password must contain at least one uppercase letter, one lowercase letter, and one number',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @MaxLength(30)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/, {
    message:
      'Password must contain at least one uppercase letter, one lowercase letter, and one number',
  })
  password!: string;
}