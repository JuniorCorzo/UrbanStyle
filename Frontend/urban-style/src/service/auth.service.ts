import type {
  AuthResponse,
  User,
  UserCredentials,
} from "@/interface/user.interface";
import type { Response } from "@/interface/response.interface";
import axios from "axios";

export const AuthRequest = async (userCredentials: UserCredentials) => {
  return await axios
    .post<AuthResponse>("http://localhost:8080/auth/login", userCredentials, {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    })
    .then((response) => {
      return response.data as AuthResponse;
    })
    .catch((error) => {
      console.error("Authentication error:", error);
      throw error;
    });
};

export const verifyToken = async (cookie: string) => {
  return await axios
    .get<User>("http://localhost:8080/auth/verify", {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
        Cookie: cookie,
      },
    })
    .then((response) => {
      return (response.data as unknown as Response<User>).data[0];
    })
    .catch((error) => {
      //   console.error("Token verification error:", error);
      throw error;
    });
};

export const logout = async () => {
  return await axios
    .get("http://localhost:8080/auth/sign-out", {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    })
    .then((response) => {
      return response.data as Response<User>;
    })
    .catch((error) => {
      console.error("Logout error:", error);
      throw error;
    });
};
