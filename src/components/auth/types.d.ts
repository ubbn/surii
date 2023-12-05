type Credential = {
  accessToken: string;
  idToken: string;
};

type User = {
  displayName: string;
  email: string;
  emailVerified: boolean;
  photoURL: string;
};

type AdditionalInfo = {
  isNewUser: boolean;
  providerId: string;
};

interface AuthResponse {
  user: User;
  credential: Credential;
  additionalUserInfo: AdditionalInfo;
}
