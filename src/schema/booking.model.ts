import { pgTable ,serial, integer, timestamp, text, date } from "drizzle-orm/pg-core";
import { users } from "./auth.model";
import { rooms } from "./hotel.model";
import { t} from "elysia";

export const bookings = pgTable('bookings', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id).notNull(),
  roomId: integer('room_id').references(() => rooms.id).notNull(),
  checkIn: date('check_in').notNull(),
  checkOut: date('check_out').notNull(),
  totalPrice: integer('total_price').notNull(),
  status: text('status').$type<'PENDING' | 'CONFIRMED' | 'CANCELLED'>().default('CONFIRMED'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const createBookingSchema = t.Object({
    roomId: t.Number(),
    checkIn: t.String(),
    checkOut: t.String(),
});