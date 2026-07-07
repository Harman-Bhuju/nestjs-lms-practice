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

  @Transform(({ value }) =>
  value.trim().charAt(0).toUpperCase() +
  value.trim().slice(1).toLowerCase()
  )
  @IsNotEmpty()
  @IsString()
  firstName!: string;


  @Transform(({ value }) =>
  value.trim().charAt(0).toUpperCase() +
  value.trim().slice(1).toLowerCase()
  )
  @IsNotEmpty()
  @IsString()
  lastName!: string;

  @Transform(({ value }) => value.trim().toLowerCase())
  @IsNotEmpty()
  @IsEmail()
  email!: string;

  @Transform(({ value }) => value.trim())
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @MaxLength(30)
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/,
    {
      message:
        'Password must contain at least one uppercase letter, one lowercase letter and one number',
    },
  )
  password!: string;

}