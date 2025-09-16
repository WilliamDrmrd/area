import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
} from 'class-validator';

export class LoginOauthDto {
  @IsString()
  @IsNotEmpty()
  token: string;
  @IsEmail()
  @IsNotEmpty()
  email: string;
}

export class LoginDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsStrongPassword()
  @IsNotEmpty()
  password: string;
}

export class RegisterOauthDto {
  @IsString()
  @IsNotEmpty()
  firstname: string;
  @IsString()
  @IsNotEmpty()
  lastname: string;
  @IsString()
  @IsNotEmpty()
  token: string;
  @IsEmail()
  @IsNotEmpty()
  email: string;
}

export class RegisterDto extends LoginDto {
  @IsString()
  @IsNotEmpty()
  username: string;
  @IsString()
  @IsNotEmpty()
  firstname: string;
  @IsString()
  @IsNotEmpty()
  lastname: string;
}
