import { db } from '../../utils/db';
import { bookings } from '../../schema/booking.model';
import { eq, and, gt, lt } from 'drizzle-orm';

export const BookingService = {
    async create(data: any, userId: number) {
        const checkIn = new Date(data.checkIn); 
        const checkOut = new Date(data.checkOut);

        const existingBookings = await db.select()
            .from(bookings)
            .where(
                and(
                    eq(bookings.roomId, data.roomId),
                    lt(bookings.checkIn, checkOut.toISOString()), 
                    gt(bookings.checkOut, checkIn.toISOString())  
                )
            );

        if (existingBookings.length > 0) {
            throw new Error("Room is already booked for these dates");
        }


        const [newBooking] = await db.insert(bookings).values({
            ...data,
            userId,
            checkIn,
            checkOut,
        }).returning();

        return newBooking;
    },

    async getUserBookings(userId: number) {
        return await db.select().from(bookings).where(eq(bookings.userId, userId));
    }
};