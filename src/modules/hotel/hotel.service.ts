import { db } from '../../utils/db';
import { hotels, rooms } from '../../schema/hotel.model';
import { eq } from 'drizzle-orm';
import { bookings } from '../../schema/booking.model';
import { and, sql, notInArray } from 'drizzle-orm';

export const HotelService = {
    // Create a new hotel listing
    async create(data: any, ownerId: number) {
        return await db.insert(hotels).values({ ...data, ownerId }).returning();
    },

    // Get all hotels, optionally filtered by city
    async getAll(city?: string) {
        if (city) {
            return await db.select().from(hotels).where(eq(hotels.city, city));
        }
        return await db.select().from(hotels);
    },

    // Get hotel details by ID, including rooms
    async getById(id: number) {
        return await db.query.hotels.findFirst({
            where: eq(hotels.id, id),
            with: { rooms: true }
        });
    },

    // Add a new room to a hotel
    async addRoom(hotelId: number, roomData: any) {
    const [newRoom] = await db.insert(rooms).values({
        ...roomData,
        hotelId
    }).returning();
    return newRoom;
}, 

    // Filter
    async getAvailableRooms(city: string, checkIn: string, checkOut: string) {
    const occupiedResults = await db
        .select({ roomId: bookings.roomId })
        .from(bookings)
        .where(
            and(
                sql`${bookings.checkIn} < ${checkOut}`,
                sql`${bookings.checkOut} > ${checkIn}`
            )
        );

    const occupiedIds = occupiedResults.map(r => r.roomId);


    let query = db
        .select({
            id: rooms.id,
            type: rooms.type,
            price: rooms.price,
            hotelName: hotels.name,
            city: hotels.city
        })
        .from(rooms)
        .innerJoin(hotels, eq(rooms.hotelId, hotels.id))
        .where(eq(hotels.city, city));


    if (occupiedIds.length > 0) {
        query = db
            .select({
                id: rooms.id,
                type: rooms.type,
                price: rooms.price,
                hotelName: hotels.name,
                city: hotels.city
            })
            .from(rooms)
            .innerJoin(hotels, eq(rooms.hotelId, hotels.id))
            .where(
                and(
                    eq(hotels.city, city),
                    notInArray(rooms.id, occupiedIds)
                )
            );
    }

    return await query;
}
};