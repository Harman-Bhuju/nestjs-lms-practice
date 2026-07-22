import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
} from 'class-validator';

export class LoginDto {

  @ApiProperty({
    example: "johndoe@gmail.com",
    description: "Email of the user"
  })
  @Transform(({ value }) =>
    typeof value === 'string' ? value.trim().toLowerCase() : value,
  )
  @IsNotEmpty()
  @IsEmail()
  email!: string;

  @ApiProperty({
    example: "password123",
    description: "Password of the user"
  })
  @Transform(({ value }) => value.trim())
  @IsNotEmpty()
  @IsString()
  password!: string;

}