import { db } from '../../utils/db';
import { bookings } from '../../schema/booking.model';
import { eq, and, or, gte, lte } from 'drizzle-orm';

export const BookingService = {
    async create(data: any, userId: number) {
        // Step 1: Check if the room is available for these dates
        // (For the first version, we will just insert. 
        // We can add the "Availability Check" logic once you get the basic POST working).
        
        const [newBooking] = await db.insert(bookings).values({
            ...data,
            userId,
            checkIn: new Date(data.checkIn),
            checkOut: new Date(data.checkOut),
        }).returning();

        return newBooking;
    },

    async getUserBookings(userId: number) {
        return await db.select().from(bookings).where(eq(bookings.userId, userId));
    }
};