import { db } from '../../utils/db';
import { hotels, rooms } from '../../schema/hotel.model';
import { eq } from 'drizzle-orm';


export const HotelService = {
    async create(data: any, ownerId: number) {
        return await db.insert(hotels).values({ ...data, ownerId }).returning();
    },

    async getAll(city?: string) {
        if (city) {
            return await db.select().from(hotels).where(eq(hotels.city, city));
        }
        return await db.select().from(hotels);
    },

    async getById(id: number) {
        return await db.query.hotels.findFirst({
            where: eq(hotels.id, id),
            with: { rooms: true }
        });
    },

    async addRoom(hotelId: number, roomData: any) {
    const [newRoom] = await db.insert(rooms).values({
        ...roomData,
        hotelId
    }).returning();
    return newRoom;
}
};