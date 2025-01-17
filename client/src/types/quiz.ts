export type Operation = 'addition' | 'subtraction' | 'multiplication' | 'division';
export type Grade = 1 | 2 | 3;

export interface Question {
  id: number;
  operation: Operation;
  grade: Grade;
  question: string;
  answer: string;
  difficulty: number;
}

export interface QuizResult {
  id: number;
  userId: number;
  score: number;
  questionsAttempted: number;
  operation: Operation;
  grade: Grade;
  createdAt: string;
}

export interface QuizSettings {
  grade: Grade;
  operation: Operation;
}
