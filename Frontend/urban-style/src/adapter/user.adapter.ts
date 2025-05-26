import type { CreateUser } from "@/interface/user.interface";
import type { CreateUserValid } from "@/lib/validations/user.validations";

export function userSchemeToUser(user: CreateUserValid): CreateUser {
  const { email, password, username, phone } = user;
  return {
    email,
    name: username,
    password,
    phone,
  };
}
