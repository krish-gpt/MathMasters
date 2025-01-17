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

// Achievement system tables
export const achievements = pgTable("achievements", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  icon: text("icon").notNull(), // Lucide icon name
  type: text("type").notNull(), // e.g., 'quiz_score', 'games_played', 'operation_mastery'
  threshold: integer("threshold").notNull(), // Value needed to earn the achievement
  operation: text("operation"), // Optional: specific operation this achievement is for
  grade: integer("grade"), // Optional: specific grade level this achievement is for
  createdAt: timestamp("created_at").defaultNow().notNull()
});

export const userAchievements = pgTable("userAchievements", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  achievementId: integer("achievement_id").references(() => achievements.id),
  earnedAt: timestamp("earned_at").defaultNow().notNull(),
  progress: integer("progress").default(0).notNull() // Track progress towards achievement
});

// Multiplayer tables
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

// Relations (defined after all tables)
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

export const achievementsRelations = relations(achievements, ({ many }) => ({
  userAchievements: many(userAchievements)
}));

export const userAchievementsRelations = relations(userAchievements, ({ one }) => ({
  user: one(users, {
    fields: [userAchievements.userId],
    references: [users.id]
  }),
  achievement: one(achievements, {
    fields: [userAchievements.achievementId],
    references: [achievements.id]
  })
}));

// Types
export type InsertUser = typeof users.$inferInsert;
export type SelectUser = typeof users.$inferSelect;
export type InsertQuestion = typeof questions.$inferInsert;
export type SelectQuestion = typeof questions.$inferSelect;
export type InsertQuizResult = typeof quizResults.$inferInsert;
export type SelectQuizResult = typeof quizResults.$inferSelect;
export type InsertAchievement = typeof achievements.$inferInsert;
export type SelectAchievement = typeof achievements.$inferSelect;
export type InsertUserAchievement = typeof userAchievements.$inferInsert;
export type SelectUserAchievement = typeof userAchievements.$inferSelect;
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
export const insertAchievementSchema = createInsertSchema(achievements);
export const selectAchievementSchema = createSelectSchema(achievements);
export const insertUserAchievementSchema = createInsertSchema(userAchievements);
export const selectUserAchievementSchema = createSelectSchema(userAchievements);
export const insertGameRoomSchema = createInsertSchema(gameRooms);
export const selectGameRoomSchema = createSelectSchema(gameRooms);
export const insertGameParticipantSchema = createInsertSchema(gameParticipants);
export const selectGameParticipantSchema = createSelectSchema(gameParticipants);