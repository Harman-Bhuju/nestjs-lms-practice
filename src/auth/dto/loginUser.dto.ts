import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
} from 'class-validator';

export class LoginDto {

  @Transform(({ value }) => value.trim().toLowerCase())
  @IsNotEmpty()
  @IsEmail()
  email!: string;

  @Transform(({ value }) => value.trim())
  @IsNotEmpty()
  @IsString()
  password!: string;

}