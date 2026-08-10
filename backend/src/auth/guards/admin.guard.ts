import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JwtPayload } from '../interfaces/jwt-payload.interface';

@Injectable()
export class AdminGuard extends AuthGuard('jwt') {
  handleRequest<TUser = JwtPayload>(err: unknown, user: TUser): TUser {
    if (err || !user) {
      throw new UnauthorizedException({
        error: 'UNAUTHORIZED',
        message: 'Missing or invalid token',
      });
    }

    if ((user as unknown as JwtPayload).role !== 'admin') {
      throw new ForbiddenException({
        error: 'FORBIDDEN',
        message: 'Admin privileges required',
      });
    }

    return user;
  }
}
