import OpenAI from "openai";
import { Question, Operation, Grade } from "@/types/quiz";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function generateQuestions(operation: Operation, grade: Grade, count: number): Promise<Question[]> {
  const prompt = `Generate ${count} age-appropriate ${operation} math questions for grade ${grade} students.
    Return in JSON format as an array of objects with properties:
    - question: string (the math problem)
    - answer: string (the correct answer)
    - difficulty: number (1-5)
    Make sure questions are appropriate difficulty and include word problems.`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [{ role: "user", content: prompt }],
    response_format: { type: "json_object" }
  });

  const result = JSON.parse(response.choices[0].message.content);
  return result.questions.map((q: any, id: number) => ({
    id,
    operation,
    grade,
    ...q
  }));
}
