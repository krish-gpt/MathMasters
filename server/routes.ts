import type { Express } from "express";
import { createServer, type Server } from "http";
import { db } from "@db";
import { questions, quizResults } from "@db/schema";
import { eq, and } from "drizzle-orm";
import type { Question, Operation, Grade } from "../client/src/types/quiz";

// Temporary question generator without OpenAI
function generateBasicQuestions(operation: Operation, grade: Grade, count: number): Question[] {
  const questions: Question[] = [];
  for (let i = 0; i < count; i++) {
    let num1, num2, answer, question;

    // Adjust number ranges based on grade
    const maxNum = grade === 1 ? 10 : grade === 2 ? 20 : 50;

    switch (operation) {
      case 'addition':
        num1 = Math.floor(Math.random() * maxNum) + 1;
        num2 = Math.floor(Math.random() * maxNum) + 1;
        answer = (num1 + num2).toString();
        question = `What is ${num1} + ${num2}?`;
        break;
      case 'subtraction':
        num1 = Math.floor(Math.random() * maxNum) + 1;
        num2 = Math.floor(Math.random() * num1) + 1; // Ensure positive result
        answer = (num1 - num2).toString();
        question = `What is ${num1} - ${num2}?`;
        break;
      case 'multiplication':
        num1 = Math.floor(Math.random() * (maxNum / 2)) + 1;
        num2 = Math.floor(Math.random() * (maxNum / 2)) + 1;
        answer = (num1 * num2).toString();
        question = `What is ${num1} × ${num2}?`;
        break;
      case 'division':
        num2 = Math.floor(Math.random() * (maxNum / 4)) + 1;
        num1 = num2 * (Math.floor(Math.random() * (maxNum / 4)) + 1);
        answer = (num1 / num2).toString();
        question = `What is ${num1} ÷ ${num2}?`;
        break;
    }

    questions.push({
      id: i,
      operation,
      grade,
      question,
      answer,
      difficulty: Math.floor(Math.random() * 3) + 1
    });
  }
  return questions;
}

export function registerRoutes(app: Express): Server {
  // Get questions for a quiz
  app.get("/api/questions", async (req, res) => {
    try {
      const grade = Number(req.query.grade) as Grade;
      const operation = req.query.operation as Operation;

      // First try to get questions from the database
      const existingQuestions = await db.query.questions.findMany({
        where: and(
          eq(questions.grade, grade),
          eq(questions.operation, operation)
        ),
        limit: 10,
      });

      if (existingQuestions.length >= 10) {
        res.json(existingQuestions);
        return;
      }

      // Generate new questions using the basic generator
      const newQuestions = generateBasicQuestions(operation, grade, 10 - existingQuestions.length);

      // Store new questions in the database
      await db.insert(questions).values(newQuestions);

      res.json([...existingQuestions, ...newQuestions]);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Failed to fetch questions" });
    }
  });

  // Submit quiz results
  app.post("/api/quiz-results", async (req, res) => {
    try {
      const result = req.body;
      const [inserted] = await db.insert(quizResults).values(result).returning();
      res.json(inserted);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Failed to save quiz result" });
    }
  });

  // Get user stats
  app.get("/api/users/:userId/stats", async (req, res) => {
    try {
      const userId = Number(req.params.userId);
      const stats = await db.query.quizResults.findMany({
        where: eq(quizResults.userId, userId),
        orderBy: (quizResults, { desc }) => [desc(quizResults.createdAt)],
      });
      res.json(stats);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Failed to fetch user stats" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}