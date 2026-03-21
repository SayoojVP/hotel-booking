import { Elysia, t } from 'elysia';
import { HotelService } from './hotel.service';
import { createHotelSchema } from '../../schema/hotel.model';
import { jwt } from '@elysiajs/jwt';
import { authPlugin } from '../../utils/auth-plugin';


export const hotelRoutes = new Elysia({ prefix: '/hotels' })
    .use(authPlugin)
    .use(jwt({ name: 'jwt', secret: process.env.JWT_SECRET! }))

    // Get all hotels, optionally filtered by city
    .get('/', ({ query }) => HotelService.getAll(query.city as string))

    // Get hotel details by ID, including rooms
    .get('/:id', ({ params }) => HotelService.getById(Number(params.id)))

    // Create a new hotel (only for owners)
    .post('/', async ({ body, user, set }) => {
        if (!user || user.role !== 'OWNER') {
            set.status = 403;
            return { error: "Only owners can list hotels" };
        }

        return await HotelService.create(body, user.id as number);
    }, {
        body: createHotelSchema // Validation schema for creating a hotel
    })
    

    // Add a new room to a hotel (only for owners)
   .post('/:id/rooms', async ({ params, body, user, set }) => {
        if (!user || user.role !== 'OWNER') {
            set.status = 403;
            return { error: "Only owners can add rooms" };
        }

        return await HotelService.addRoom(Number(params.id), body);
    })


    // Search for available rooms based on city and date range
    .get('/search', async ({ query, set }) => {
        const { city, checkIn, checkOut } = query;

     if (!city || !checkIn || !checkOut) {
         set.status = 400;
         return { error: "Missing search criteria (city, checkIn, checkOut)" };
     }

      return await HotelService.getAvailableRooms(
          city as string, 
          checkIn as string, 
          checkOut as string
       );
});

