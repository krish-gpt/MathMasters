import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { QuizCard } from "@/components/quiz/QuizCard";
import { ScoreDisplay } from "@/components/quiz/ScoreDisplay";
import { CelebrationEffect } from "@/components/quiz/CelebrationEffect";
import { Question, Grade, Operation } from "@/types/quiz";
import { useQuery, useMutation } from "@tanstack/react-query";
import { fetchQuestions, submitQuizResult } from "@/lib/api";
import { Button } from "@/components/ui/button";

export default function Quiz() {
  const [, setLocation] = useLocation();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);

  const searchParams = new URLSearchParams(window.location.search);
  const grade = Number(searchParams.get("grade")) as Grade;
  const operation = searchParams.get("operation") as Operation;

  const { data: questions, isLoading } = useQuery({
    queryKey: ["/api/questions", grade, operation],
    queryFn: () => 
      operation && grade ? fetchQuestions({ grade, operation }) : Promise.reject("Invalid parameters"),
    enabled: !!grade && !!operation
  });

  const submitMutation = useMutation({
    mutationFn: submitQuizResult,
    onSuccess: () => {
      setShowCelebration(true);
      setTimeout(() => setLocation("/"), 3000);
    },
  });

  const handleAnswer = (correct: boolean) => {
    if (correct) {
      setScore((prev) => prev + 1);
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 1500);
    }

    if (currentQuestion + 1 < (questions?.length || 0)) {
      setCurrentQuestion((prev) => prev + 1);
    } else {
      submitMutation.mutate({
        userId: 1, // TODO: Replace with actual user ID
        score,
        questionsAttempted: questions?.length || 0,
        operation,
        grade,
      });
    }
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
        <ScoreDisplay score={score} total={questions?.length || 0} />

        <div className="mt-8">
          {questions && questions[currentQuestion] && (
            <QuizCard
              question={questions[currentQuestion]}
              onAnswer={handleAnswer}
            />
          )}
        </div>

        <div className="mt-8 text-center">
          <Button
            variant="outline"
            onClick={() => setLocation("/")}
          >
            Back to Home
          </Button>
        </div>

        <CelebrationEffect show={showCelebration} />
      </div>
    </div>
  );
}