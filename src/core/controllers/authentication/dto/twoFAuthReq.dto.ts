
import {
    IsString,
    Length,
    IsNumberString,
    IsNotEmpty,
  } from 'class-validator';
  
  export class TwoFAuthReqDto {
    @IsNotEmpty()
    @Length(20, 26)
    userId: string;
  }
   
  export default TwoFAuthReqDto;