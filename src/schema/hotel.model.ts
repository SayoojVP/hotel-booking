import { pgTable, serial, text, integer, timestamp } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { users } from '../utils/db/schema'; // Importing users table for foreign key reference
import { t } from 'elysia';

// Table for the Hotel Property
export const hotels = pgTable('hotels', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  city: text('city').notNull(),
  address: text('address').notNull(),
  ownerId: integer('owner_id').references(() => users.id).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

// Table for individual Rooms in that Hotel
export const rooms = pgTable('rooms', {
  id: serial('id').primaryKey(),
  hotelId: integer('hotel_id').references(() => hotels.id).notNull(),
  type: text('type').$type<'CLASSIC' | 'DELUXE' | 'SUITE'>().default('CLASSIC'),
  price: integer('price').notNull(), 
  capacity: integer('capacity').default(2),
});

// Relations for Drizzle (This makes querying easier)
export const hotelRelations = relations(hotels, ({ many }) => ({
  rooms: many(rooms),
}));

export const roomRelations = relations(rooms, ({ one }) => ({
  hotel: one(hotels, {
    fields: [rooms.hotelId],
    references: [hotels.id],
  }),
}));

// Validation Schemas
export const createHotelSchema = t.Object({
  name: t.String(),
  city: t.String(),
  address: t.String(),
});