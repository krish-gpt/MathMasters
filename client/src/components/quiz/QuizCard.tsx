import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Question } from "@/types/quiz";
import { motion } from "framer-motion";

interface QuizCardProps {
  question: Question;
  onAnswer: (correct: boolean) => void;
}

export function QuizCard({ question, onAnswer }: QuizCardProps) {
  const [answer, setAnswer] = useState("");
  const [showFeedback, setShowFeedback] = useState(false);

  const checkAnswer = () => {
    const isCorrect = answer.trim() === question.answer.trim();
    setShowFeedback(true);
    setTimeout(() => {
      setShowFeedback(false);
      setAnswer("");
      onAnswer(isCorrect);
    }, 1500);
  };

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="p-6">
          <h3 className="text-2xl font-bold text-center mb-4">{question.question}</h3>
          <div className="flex gap-4">
            <Input
              type="text"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Your answer..."
              className="text-xl"
              onKeyDown={(e) => e.key === 'Enter' && checkAnswer()}
            />
            <Button onClick={checkAnswer} size="lg">
              Check
            </Button>
          </div>
          {showFeedback && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mt-4 text-center text-lg font-bold ${
                answer === question.answer ? "text-green-500" : "text-red-500"
              }`}
            >
              {answer === question.answer ? "Correct! 🎉" : "Try again! 💪"}
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
