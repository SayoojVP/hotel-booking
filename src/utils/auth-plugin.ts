import { Elysia } from 'elysia';
import { jwt } from '@elysiajs/jwt';

export const authPlugin = new Elysia()
    .use(
        jwt({
            name: 'jwt',
            secret: process.env.JWT_SECRET!
        })
    )
    .derive({ as: 'global' }, async ({ jwt, set, request: { headers } }) => {
        const authHeader = headers.get('authorization');
        const token = authHeader?.split(' ')[1];
        
        const payload = await jwt.verify(token);

        if (!payload) {
            set.status = 401;
            return {
                user: null // We return null so the route knows auth failed
            };
        }

        return {
            user: payload
        };
    });