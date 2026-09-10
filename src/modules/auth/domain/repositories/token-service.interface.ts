export const TOKEN_SERVICE = 'TOKEN_SERVICE';

export interface ITokenService {
  signPayload(payload: { sub: string; email: string }): string;
}
