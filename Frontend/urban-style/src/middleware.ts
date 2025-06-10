import { defineMiddleware } from "astro:middleware";
import { verifyToken } from "./service/auth.service";

export const onRequest = defineMiddleware(async (context, next) => {
  try {
    const cookie = context.request.headers.get("cookie");
    if (cookie) {
      const user = await verifyToken(cookie);
      if (!user) return next();

      context.locals.user = user;
      context.locals.accessToken = cookie.split("=")[1];
    }
  } catch (error) {
    console.error("Error validating session");
  }
  return next();
});
