import type { JwtPayload } from "jwt-decode";

export interface JwtClaims extends JwtPayload {
  userId: string;
}
