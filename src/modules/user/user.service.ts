import { db } from '../../utils/db';
import { users } from '../../schema/auth.model'; 
import { eq } from 'drizzle-orm';

export const UserService = {
    // Get user profile by ID
    async getById(id: number) {
        const [user] = await db.select().from(users).where(eq(users.id, id));
        if (!user) return null;
        
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
    },

    // Update user profile
    async update(id: number, data: any) {
        const [updatedUser] = await db
            .update(users)
            .set(data)
            .where(eq(users.id, id))
            .returning();
            
        const { password, ...userWithoutPassword } = updatedUser;
        return userWithoutPassword;
    }
};