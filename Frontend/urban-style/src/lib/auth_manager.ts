import type { JwtClaims } from "@/interface/jwt-payload.interface";
import type { User, UserCredentials } from "@/interface/user.interface";
import { AuthRequest, verifyToken } from "@/service/auth.service";
import { jwtDecode } from "jwt-decode";

export class Auth {
  private static instance: Auth;
  public user: User | null = null;
  private userId: string | null = null;
  private accessToken: string | null = null;

  private constructor() {}

  public static getInstance(): Auth {
    if (!Auth.instance) {
      Auth.instance = new Auth();
    }
    return Auth.instance;
  }

  public async login(userCredentials: UserCredentials) {
    const { userId } = jwtDecode<JwtClaims>(this.accessToken as string);
    this.setUserId(userId);

    // this.createSession();
    location.replace("/home");
  }

  // this function is used to check if the user cookie is valid in the
  // server side
  public async validateSession(cookie: string) {
    const user = await verifyToken(cookie);
    if (!user) {
      throw new Error("Invalid session");
    }

    return user;
  }

  public async logout() {
    await this.logout();
    sessionStorage.removeItem("user_session");
  }

  // async createSession(userParam?: User) {
  //   const user = userParam ?? (await getUserById(this.userId as string));
  //   sessionStorage.setItem("user_session", JSON.stringify(user));
  // }

  public getUserId(): string | undefined {
    console.log(this.user);
    return this.user?.id;
  }

  public setUserId(userId: string): void {
    this.userId = userId;
  }

  public getToken(): string | null {
    return this.accessToken;
  }

  public setToken(token: string): void {
    this.accessToken = token;
  }
}
