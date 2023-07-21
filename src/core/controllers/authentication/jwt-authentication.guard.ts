import { Injectable, ExecutionContext, Response } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

// @added response object transmission, to be reach in JwtStrategy
@Injectable()
export default class JwtAuthenticationGuard extends AuthGuard('jwt') {
    canActivate(@Response({passthrough: true}) res) {
        return super.canActivate(res);
    }
}