import { Elysia } from 'elysia';
import { BookingService } from './booking.service';
import { createBookingSchema } from '../../schema/booking.model';
import { jwt } from '@elysiajs/jwt';        
import { authPlugin } from '../../utils/auth-plugin';

export const bookingRoutes = new Elysia({ prefix: '/bookings' })
    .use(authPlugin)
    .get('/my-bookings', async ({user, set}) => {
        if (!user) {
            set.status = 401;
            return { error: "Unauthorized" };
        }

        return await BookingService.getUserBookings(user.id as number);
    })

    // Create a new booking
    .post('/', async ({ body, user, set }) => {
        if (!user) return { error: "Please login to book" };

        return await BookingService.create(body, user.id as number);
    });