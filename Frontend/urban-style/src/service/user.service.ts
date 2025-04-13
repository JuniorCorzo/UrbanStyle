import type { Response } from "@/interface/response.interface";
import type { User } from "@/interface/user.interface";
import axios from "axios";

export const getUserById = async (userId: string) => {
  return await axios
    .get<User>(`http://localhost:8080/users/${userId}`, {
      headers: {
        "Content-Type": "application/json",
      },
    })
    .then((response) => {
      return (response.data as unknown as Response<User>).data[0];
    })
    .catch((error) => {
      console.error("Error fetching user by ID:", error);
      throw error;
    });
};
