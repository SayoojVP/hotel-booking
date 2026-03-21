import { Elysia, t } from 'elysia';
import { AuthService } from './auth.service';
import { registerSchema, loginSchema } from '../../schema/auth.model';
import { jwt } from '@elysiajs/jwt';

export const authRoutes = new Elysia({ prefix: '/auth' })
    .use(
        jwt({
            name: 'jwt',
            secret: process.env.JWT_SECRET!
        })
    )

    // Registration route
    .post('/register', async ({ body, set }) => {
        try {
            const user = await AuthService.register(body);
            set.status = 201;
            return { message: "User created", user };
        } catch (e: any) {
            set.status = 400;
            console.error(e);
            return { error: "User already exists or invalid data" };
        }
    }, {
        body: registerSchema  // Validation schema for registration
    })

    // Login route
    .post('/login', async ({ body, jwt, set, cookie: { auth } }) => {
        const user = await AuthService.validateUser(body.email);
        
        if (!user || !(await Bun.password.verify(body.password, user.password))) {
            set.status = 401;
            return { error: "Invalid credentials" };
        }

        const token = await jwt.sign({ id: user.id, role: user.role });
        
        return { message: "Logged in", token };
    }, {
        body: loginSchema // Validation schema for login
    });