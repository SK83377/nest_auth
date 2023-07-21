import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { detectionList } from './detectionList';

// @check data API inner data for sql-injections and js-operators. If data consists nested objects or arrays, search methods will be called recursively. Detection list array can be expanded with needed search parameteres.
@Injectable()
export class DataValidateService {
    public async checkEmail (email: string) {
        const emailRule = await /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
        if (!emailRule.test(email.toLowerCase())) throw new HttpException('Wrong credentials provided', HttpStatus.BAD_REQUEST);
        else return true;
    }
    public async checkData (toCheck: object | string) {
        if (typeof toCheck == 'string') {
            await this.sqlInjCheck(toCheck);
        } else {
            const toCheckArr = Object.values(toCheck);
            for (let i=0;i<toCheckArr.length;i++) {
                if (typeof toCheckArr[i] == 'string') {
                    await this.sqlInjCheck(toCheckArr[i]);
                }
            }
        }
    }
    private async sqlInjCheck (toCheck: string) {
        for (let i=0;i<detectionList.length;i++) {
            if (toCheck.indexOf(detectionList[i]) != -1) {
                throw new HttpException('Wrong credentials provided', HttpStatus.BAD_REQUEST);
            }
        }
    }
}
