import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JwtPayload } from '../interfaces/jwt-payload.interface';

@Injectable()
export class EmployeeGuard extends AuthGuard('jwt') {
  handleRequest<TUser = JwtPayload>(err: unknown, user: TUser): TUser {
    if (err || !user) {
      throw new UnauthorizedException({
        error: 'UNAUTHORIZED',
        message: 'Missing or invalid token',
      });
    }

    if ((user as unknown as JwtPayload).role !== 'employee') {
      throw new ForbiddenException({
        error: 'FORBIDDEN',
        message: 'Employee privileges required',
      });
    }

    return user;
  }
}
