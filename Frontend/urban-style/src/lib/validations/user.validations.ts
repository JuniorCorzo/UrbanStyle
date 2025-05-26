import { z } from "zod";

const passwordSchema = z
  .string()
  .max(32, { message: "La contraseña no puede exceder los 32 caracteres" })
  .min(8, { message: "La contraseña debe tener al menos 8 caracteres" })
  .refine(
    (password) =>
      /[A-Z]/.test(password) &&
      /[a-z]/.test(password) &&
      /[0-9]/.test(password) &&
      /[!@#$%^&*]/.test(password),
    {
      message:
        "Incluye letra mayúscula, minúscula, número y símbolo (!@#$%^&*)",
    }
  );

export const userCredentialsSchema = z.object({
  email: z
    .string({ required_error: "El correo electrónico es requerido" })
    .email("El correo electrónico no es válido"),
  password: passwordSchema,
});
export type UserCredentialsValid = z.infer<typeof userCredentialsSchema>;

export const createUserSchema = userCredentialsSchema
  .extend({
    username: z
      .string({ required_error: "El nombre de usuario es requerido" })
      .min(3, "El nombre de usuario debe tener al menos 3 caracteres")
      .max(32, "El nombre de usuario no puede exceder los 32 caracteres"),
    phone: z
      .string()
      .min(10, "Número inválido")
      .max(10, "Número inválido")
      .refine((number) => /^\d{10}$/.test(number), {
        message: "Número inválido",
      }),
    password: passwordSchema,
    confirm_password: z.string({
      required_error: "La confirmación de contraseña es requerida",
    }),
  })
  .refine(({ password, confirm_password }) => password === confirm_password, {
    message: "Las contraseñas no coinciden",
    path: ["confirm_password"],
  });

export type CreateUserValid = z.infer<typeof createUserSchema>;
