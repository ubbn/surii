interface AuthResponse {
  user: {
    displayName: string;
    email: string;
    emailVerified: boolean;
    photoURL: string;
    stsTokenManager: TokenManager;
  };
  credential: {
    accessToken: string;
    idToken: string;
  };
  additionalUserInfo: {
    isNewUser: boolean;
    providerId: string;
  };
}

interface TokenManager {
  accessToken: string;
  expirationTime: number;
  refreshToken: string;
}
