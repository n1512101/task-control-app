export interface IRefreshToken {
  userId: object;
  refreshToken: string;
  expiresAt: Date;
  createdAt: Date;
}
