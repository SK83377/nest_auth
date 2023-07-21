
import {
    IsString,
    Length,
    IsNumberString,
    IsNotEmpty,
  } from 'class-validator';
  
  export class VerifyTGDto {
    @IsNotEmpty()
    @IsString()
    @Length(8, 16)
    chatId: string;
  
    @IsNotEmpty()
    @IsString()
    @Length(8, 8)
    code: string;
  }
   
  export default VerifyTGDto;