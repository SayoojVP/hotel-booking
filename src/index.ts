import { Elysia } from "elysia";
import { authRoutes } from "./modules/auth/auth.index";
import { userRoutes } from "./modules/user/user.index";

const app = new Elysia()
  .use(authRoutes)
  .use(userRoutes)
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);


