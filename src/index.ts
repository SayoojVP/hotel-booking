import { Elysia } from "elysia";
import { authRoutes } from "./modules/auth/auth.index";
import { userRoutes } from "./modules/user/user.index";
import { hotelRoutes } from "./modules/hotel/hotel.index";


const app = new Elysia()
  .use(authRoutes)
  .use(userRoutes)
  .use(hotelRoutes)
  .listen(3000);  


console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);


