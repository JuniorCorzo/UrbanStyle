export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  phone: string;
}

export interface CreateUser extends Omit<User, "id"> {}

export interface UserCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
}
