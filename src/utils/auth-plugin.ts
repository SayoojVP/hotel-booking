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
        console.log("Auth Header Received:", authHeader);
        const token = authHeader?.split(' ')[1];
        
        const payload = await jwt.verify(token);
        console.log("JWT Payload:", payload);

        if (!payload) {
            set.status = 401;
            return {
                user: null 
            };
        }

        return {
            user: payload
        };
    });