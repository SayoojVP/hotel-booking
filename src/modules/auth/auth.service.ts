import { db } from '../../utils/db'; 
import { users } from '../../schema/auth.model';
import { eq } from 'drizzle-orm';

export const AuthService = {
    async register(data: any) {
    //  Hashing the password using Bun's built-in utility
        const hashedPassword = await Bun.password.hash(data.password);

        // Insert into Neon via Drizzle
        const [newUser] = await db.insert(users).values({
            ...data,
            password: hashedPassword,
        }).returning();

        //Remove password from the returned object for security
        const { password, ...userWithoutPassword } = newUser;
        return userWithoutPassword;
    },

    // Validate user by email for login
    async validateUser(email: string) {
        const [user] = await db.select().from(users).where(eq(users.email, email));
        return user;
    }
};