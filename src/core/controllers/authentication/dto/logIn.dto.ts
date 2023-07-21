import {
  IsString,
  Length,
  IsNumberString,
  IsNotEmpty,
} from 'class-validator';

export class LogInDto {
  @IsNotEmpty()
  @IsNumberString()
  @Length(8, 12)
  phone: string;

  @IsNotEmpty()
  @IsString()
  @Length(8, 16)
  password: string;
}
 
export default LogInDto;