interface AuthResponse {
  user: {
    displayName: string;
    email: string;
    emailVerified: boolean;
    photoURL: string;
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
