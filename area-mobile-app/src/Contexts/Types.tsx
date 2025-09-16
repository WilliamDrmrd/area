export interface UserInfo {
  name: string;
  email: string;
  picture: string;
}

export interface AuthData {
  accessToken?: string;
  refreshToken?: string;
  expiresIn?: number;
  issuedAt?: number;
  // ... d'autres champs si nécessaire
}
