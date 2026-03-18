import { Elysia, t } from 'elysia';
import { HotelService } from './hotel.service';
import { createHotelSchema } from '../../schema/hotel.model';
import { jwt } from '@elysiajs/jwt';

export const hotelRoutes = new Elysia({ prefix: '/hotels' })
    .use(jwt({ name: 'jwt', secret: process.env.JWT_SECRET! }))
    .get('/', ({ query }) => HotelService.getAll(query.city as string))
    .get('/:id', ({ params }) => HotelService.getById(Number(params.id)))
    .post('/', async ({ body, jwt, set, request: { headers } }) => {
        // verify owner identity via JWT
        const authHeader = headers.get('authorization');
        const token = authHeader?.split(' ')[1];
        const payload = await jwt.verify(token);

        if (!payload || payload.role !== 'OWNER') {
            set.status = 403;
            return { error: "Only owners can list hotels" };
        }

        return await HotelService.create(body, payload.id as number);
    }, {
        body: createHotelSchema
    });