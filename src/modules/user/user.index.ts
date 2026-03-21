import { Elysia, t } from 'elysia';
import { UserService } from './user.service';
import { updateUserSchema } from '../../schema/user.model';
import { jwt } from '@elysiajs/jwt';

export const userRoutes = new Elysia({ prefix: '/user' })  //route group created with prefix /user
    .use(
        jwt({
            name: 'jwt',
            secret: process.env.JWT_SECRET!
        })
    )

    // Get user profile
    .get('/profile', async ({ jwt, set, request: { headers } }) => {
        // Simple helper to get token from 'Authorization: Bearer <token>'
        const authHeader = headers.get('authorization');
        const token = authHeader?.split(' ')[1];
        
        if (!token) {
            set.status = 401;
            return { error: 'Unauthorized' };
        }

        const payload = await jwt.verify(token);
        if (!payload) {
            set.status = 401;
            return { error: 'Invalid token' };
        }

        const user = await UserService.getById(payload.id as number);
        return user;
    })

    // Update user profile
    .patch('/profile', async ({ jwt, body, set, request: { headers } }) => {
        const authHeader = headers.get('authorization');
        const token = authHeader?.split(' ')[1];
        
        const payload = await jwt.verify(token);
        if (!payload) {
            set.status = 401;
            return { error: 'Unauthorized' };
        }

        return await UserService.update(payload.id as number, body);
    }, {
        body: updateUserSchema
    });