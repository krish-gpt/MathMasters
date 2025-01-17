import { pgTable, text, serial, integer, timestamp, jsonb, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

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

export type InsertUser = typeof users.$inferInsert;
export type SelectUser = typeof users.$inferSelect;
export type InsertQuestion = typeof questions.$inferInsert;
export type SelectQuestion = typeof questions.$inferSelect;
export type InsertQuizResult = typeof quizResults.$inferInsert;
export type SelectQuizResult = typeof quizResults.$inferSelect;

export const insertUserSchema = createInsertSchema(users);
export const selectUserSchema = createSelectSchema(users);
export const insertQuestionSchema = createInsertSchema(questions);
export const selectQuestionSchema = createSelectSchema(questions);
export const insertQuizResultSchema = createInsertSchema(quizResults);
export const selectQuizResultSchema = createSelectSchema(quizResults);