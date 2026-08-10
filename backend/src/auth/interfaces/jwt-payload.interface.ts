export interface JwtPayload {
  sub: number;
  role: 'admin' | 'employee';
}
