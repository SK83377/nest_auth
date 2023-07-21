import {
  IsString,
  Length,
  IsEmail,
  IsNumberString,
  IsNotEmpty,
} from 'class-validator';

export class RegisterDto {
  @IsNotEmpty()
  @IsString()
  @Length(1, 14)
  name: string;

  @IsNotEmpty()
  @IsString()
  @Length(4, 20)
  email: string;

  @IsNotEmpty()
  @IsNumberString()
  @Length(8, 12)
  phone: string;

  @IsNotEmpty()
  @IsString()
  @Length(8, 16)
  password: string;
}
   
export default RegisterDto;