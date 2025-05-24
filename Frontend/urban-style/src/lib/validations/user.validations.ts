import { z } from "zod";

export const userCredentialsSchema = z.object({
  email: z
    .string()
    .min(1, "El correo electrónico es requerido")
    .email("El correo electrónico no es válido"),
  password: z.string().min(1, "La contraseña es requerida"),
});
export type UserCredentialsValid = z.infer<typeof userCredentialsSchema>;
