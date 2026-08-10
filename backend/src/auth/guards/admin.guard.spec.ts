import { ForbiddenException, UnauthorizedException } from '@nestjs/common';
import { AdminGuard } from './admin.guard';

describe('AdminGuard', () => {
  const guard = new AdminGuard();

  it('rejects when no user is returned (missing/invalid token)', () => {
    expect(() => guard.handleRequest(null, null as never)).toThrow(
      UnauthorizedException,
    );
  });

  it('rejects when passport reports an error (expired/invalid signature)', () => {
    expect(() =>
      guard.handleRequest(new Error('jwt expired'), null as never),
    ).toThrow(UnauthorizedException);
  });

  it('rejects a valid token whose role is not admin', () => {
    expect(() =>
      guard.handleRequest(null, { sub: 1, role: 'employee' }),
    ).toThrow(ForbiddenException);
  });

  it('accepts a valid admin token', () => {
    const user = { sub: 1, role: 'admin' as const };
    expect(guard.handleRequest(null, user)).toEqual(user);
  });
});
