import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { QuizCard } from "@/components/quiz/QuizCard";
import { ScoreDisplay } from "@/components/quiz/ScoreDisplay";
import { CelebrationEffect } from "@/components/quiz/CelebrationEffect";
import { Question, Grade, Operation } from "@/types/quiz";
import { useQuery, useMutation } from "@tanstack/react-query";
import { fetchQuestions, submitQuizResult } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const MAX_QUESTIONS = 10;

export default function Quiz() {
  const [, setLocation] = useLocation();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const searchParams = new URLSearchParams(window.location.search);
  const grade = Number(searchParams.get("grade")) as Grade;
  const operation = searchParams.get("operation") as Operation;

  const { data: questions, isLoading } = useQuery({
    queryKey: ["/api/questions", grade, operation],
    queryFn: () =>
      operation && grade
        ? fetchQuestions({ grade, operation })
        : Promise.reject("Invalid parameters"),
    enabled: !!grade && !!operation,
  });

  const submitMutation = useMutation({
    mutationFn: submitQuizResult,
    onSuccess: () => {
      setShowCelebration(true);
      setTimeout(() => {
        setLocation("/");
      }, 3000);
    },
  });

  const handleAnswer = (correct: boolean) => {
    if (correct) {
      const newScore = score + 1;
      setScore(newScore);
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 1500);

      // If we've achieved a perfect score before reaching max questions
      if (newScore === MAX_QUESTIONS) {
        handleQuizCompletion(newScore);
        return;
      }
    }

    // Check if we should move to next question or end the quiz
    if (currentQuestion + 1 < Math.min(MAX_QUESTIONS, questions?.length || 0)) {
      setCurrentQuestion((prev) => prev + 1);
    } else {
      handleQuizCompletion(score + (correct ? 1 : 0));
    }
  };

  const handleQuizCompletion = (finalScore: number) => {
    setIsCompleted(true);
    submitMutation.mutate({
      userId: 1, // TODO: Replace with actual user ID
      score: finalScore,
      questionsAttempted: currentQuestion + 1,
      operation,
      grade,
    });
  };

  if (!grade || !operation) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Invalid Quiz Parameters</h2>
          <Button onClick={() => setLocation("/")}>Back to Home</Button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl">Loading questions...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-100 to-blue-100 py-12">
      <div className="container mx-auto px-4">
        <ScoreDisplay score={score} total={Math.min(MAX_QUESTIONS, questions?.length || 0)} />

        <motion.div
          className="mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {!isCompleted && questions && questions[currentQuestion] && (
            <QuizCard
              question={questions[currentQuestion]}
              onAnswer={handleAnswer}
            />
          )}

          {isCompleted && (
            <div className="text-center">
              <motion.h2
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-3xl font-bold mb-4"
              >
                {score === MAX_QUESTIONS ? "Perfect Score! 🌟" : "Quiz Completed!"}
              </motion.h2>
              <p className="text-lg mb-6">
                You got {score} out of {currentQuestion + 1} questions correct!
              </p>
            </div>
          )}
        </motion.div>

        <div className="mt-8 text-center">
          <Button variant="outline" onClick={() => setLocation("/")}>
            Back to Home
          </Button>
        </div>

        <CelebrationEffect show={showCelebration} />
      </div>
    </div>
  );
}