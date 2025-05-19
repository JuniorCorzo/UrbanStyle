import { defineMiddleware } from "astro:middleware";
import { Auth } from "./lib/auth_manager";

export const onRequest = defineMiddleware(async (context, next) => {
  try {
    const cookie = context.request.headers.get("cookie");
    if (cookie) {
      const user = await Auth.getInstance().validateSession(cookie as string);
      if (!user) return next();
      context.locals.user = user;
    }
  } catch (error) {
    console.error("Error validating session");
  }
  return next();
});
