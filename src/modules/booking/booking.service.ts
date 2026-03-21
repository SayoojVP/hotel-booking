import { db } from '../../utils/db';
import { bookings } from '../../schema/booking.model';
import { eq, and, gt, lt } from 'drizzle-orm';
import { rooms } from '../../schema/hotel.model';

export const BookingService = {
    async create(data: any, userId: number) {   

        const room = await db.query.rooms.findFirst({
            where: eq(rooms.id, data.roomId)
        });

        if (!room) throw new Error("Room not found");   

        const checkIn = new Date(data.checkIn); 
        const checkOut = new Date(data.checkOut);

        const diffTime = Math.abs(checkIn.getTime() - checkOut.getTime());  
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));   

        if (diffDays <= 0) throw new Error("Check-out must be after check-in");

        const totalPrice = diffDays * room.price;

        const existingBookings = await db.select()
            .from(bookings)
            .where(
                and(
                    eq(bookings.roomId, data.roomId),                   // Check for overlapping bookings
                    lt(bookings.checkIn, checkOut.toISOString()), 
                    gt(bookings.checkOut, checkIn.toISOString())  
                )
            );

        if (existingBookings.length > 0) {
            throw new Error("Room is already booked for these dates");
        }


        const [newBooking] = await db.insert(bookings).values({
            ...data,
            userId,                                                     // Associate booking with the user
            totalPrice
        }).returning();

        return newBooking;
    },

    async getUserBookings(userId: number) {
        return await db.select().from(bookings).where(eq(bookings.userId, userId));     // Fetch bookings for the logged-in user
    }
};