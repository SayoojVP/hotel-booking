import { Elysia } from "elysia";
import { authRoutes } from "./modules/auth/auth.index";
import { userRoutes } from "./modules/user/user.index";
import { hotelRoutes } from "./modules/hotel/hotel.index";
import { bookingRoutes } from "./modules/booking/booking.index";

// Initialize Elysia app and register routes
const app = new Elysia()
  .get("/debug-path", () => "Path is working")
  .use(authRoutes)
  .use(userRoutes)
  .use(hotelRoutes)
  .use(bookingRoutes)
  .listen(3000);  


console.log(
  `Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);


