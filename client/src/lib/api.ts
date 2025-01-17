import { Question, QuizResult, QuizSettings } from "@/types/quiz";
import { Achievement, UserAchievement } from "@/types/achievement";

const API_BASE = '/api';

export async function fetchQuestions(settings: QuizSettings): Promise<Question[]> {
  const response = await fetch(`${API_BASE}/questions?grade=${settings.grade}&operation=${settings.operation}`);
  if (!response.ok) throw new Error('Failed to fetch questions');
  return response.json();
}

export async function submitQuizResult(result: Omit<QuizResult, 'id' | 'createdAt'>): Promise<QuizResult> {
  const response = await fetch(`${API_BASE}/quiz-results`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(result),
  });
  if (!response.ok) throw new Error('Failed to submit quiz result');
  return response.json();
}

export async function getUserStats(userId: number): Promise<QuizResult[]> {
  const response = await fetch(`${API_BASE}/users/${userId}/stats`);
  if (!response.ok) throw new Error('Failed to fetch user stats');
  return response.json();
}

// New achievement-related API calls
export async function getAchievements(): Promise<Achievement[]> {
  const response = await fetch(`${API_BASE}/achievements`);
  if (!response.ok) throw new Error('Failed to fetch achievements');
  return response.json();
}

export async function getUserAchievements(userId: number): Promise<UserAchievement[]> {
  const response = await fetch(`${API_BASE}/users/${userId}/achievements`);
  if (!response.ok) throw new Error('Failed to fetch user achievements');
  return response.json();
}

export async function checkNewAchievements(userId: number): Promise<UserAchievement[]> {
  const response = await fetch(`${API_BASE}/users/${userId}/achievements/check`, {
    method: 'POST',
  });
  if (!response.ok) throw new Error('Failed to check achievements');
  return response.json();
}