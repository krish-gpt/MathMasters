import { pgTable, text, serial, integer, timestamp, jsonb, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { relations } from "drizzle-orm";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").unique().notNull(),
  grade: integer("grade").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull()
});

export const questions = pgTable("questions", {
  id: serial("id").primaryKey(),
  operation: text("operation").notNull(),
  grade: integer("grade").notNull(),
  question: text("question").notNull(),
  answer: text("answer").notNull(),
  difficulty: integer("difficulty").notNull(),
  aiGenerated: boolean("ai_generated").default(true).notNull(),
  metadata: jsonb("metadata")
});

export const quizResults = pgTable("quizResults", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  score: integer("score").notNull(),
  questionsAttempted: integer("questions_attempted").notNull(),
  operation: text("operation").notNull(),
  grade: integer("grade").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull()
});

// New tables for multiplayer support
export const gameRooms = pgTable("gameRooms", {
  id: serial("id").primaryKey(),
  code: text("code").unique().notNull(),
  status: text("status").notNull().default("waiting"), // waiting, active, completed
  grade: integer("grade").notNull(),
  operation: text("operation").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  startedAt: timestamp("started_at"),
  endedAt: timestamp("ended_at")
});

export const gameParticipants = pgTable("gameParticipants", {
  id: serial("id").primaryKey(),
  gameRoomId: integer("game_room_id").references(() => gameRooms.id),
  userId: integer("user_id").references(() => users.id),
  score: integer("score").default(0).notNull(),
  status: text("status").notNull().default("waiting"), // waiting, ready, playing, finished
  joinedAt: timestamp("joined_at").defaultNow().notNull()
});

// Relations
export const gameRoomsRelations = relations(gameRooms, ({ many }) => ({
  participants: many(gameParticipants)
}));

export const gameParticipantsRelations = relations(gameParticipants, ({ one }) => ({
  gameRoom: one(gameRooms, {
    fields: [gameParticipants.gameRoomId],
    references: [gameRooms.id]
  }),
  user: one(users, {
    fields: [gameParticipants.userId],
    references: [users.id]
  })
}));

// Types
export type InsertUser = typeof users.$inferInsert;
export type SelectUser = typeof users.$inferSelect;
export type InsertQuestion = typeof questions.$inferInsert;
export type SelectQuestion = typeof questions.$inferSelect;
export type InsertQuizResult = typeof quizResults.$inferInsert;
export type SelectQuizResult = typeof quizResults.$inferSelect;
export type InsertGameRoom = typeof gameRooms.$inferInsert;
export type SelectGameRoom = typeof gameRooms.$inferSelect;
export type InsertGameParticipant = typeof gameParticipants.$inferInsert;
export type SelectGameParticipant = typeof gameParticipants.$inferSelect;

// Schemas
export const insertUserSchema = createInsertSchema(users);
export const selectUserSchema = createSelectSchema(users);
export const insertQuestionSchema = createInsertSchema(questions);
export const selectQuestionSchema = createSelectSchema(questions);
export const insertQuizResultSchema = createInsertSchema(quizResults);
export const selectQuizResultSchema = createSelectSchema(quizResults);
export const insertGameRoomSchema = createInsertSchema(gameRooms);
export const selectGameRoomSchema = createSelectSchema(gameRooms);
export const insertGameParticipantSchema = createInsertSchema(gameParticipants);
export const selectGameParticipantSchema = createSelectSchema(gameParticipants);