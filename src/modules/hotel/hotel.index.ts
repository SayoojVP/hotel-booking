import { Elysia, t } from 'elysia';
import { HotelService } from './hotel.service';
import { createHotelSchema } from '../../schema/hotel.model';
import { jwt } from '@elysiajs/jwt';
import { authPlugin } from '../../utils/auth-plugin';

export const hotelRoutes = new Elysia({ prefix: '/hotels' })
    .use(authPlugin)
    .use(jwt({ name: 'jwt', secret: process.env.JWT_SECRET! }))
    .get('/', ({ query }) => HotelService.getAll(query.city as string))
    .get('/:id', ({ params }) => HotelService.getById(Number(params.id)))
    .post('/', async ({ body, user, set }) => {
        if (!user || user.role !== 'OWNER') {
            set.status = 403;
            return { error: "Only owners can list hotels" };
        }

        return await HotelService.create(body, user.id as number);
    }, {
        body: createHotelSchema
    })
    
   .post('/:id/rooms', async ({ params, body, user, set }) => {
        if (!user || user.role !== 'OWNER') {
            set.status = 403;
            return { error: "Only owners can add rooms" };
        }

        return await HotelService.addRoom(Number(params.id), body);
    });