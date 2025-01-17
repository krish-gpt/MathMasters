import { useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GradeSelector } from "@/components/quiz/GradeSelector";
import { OperationSelector } from "@/components/quiz/OperationSelector";
import { Grade, Operation } from "@/types/quiz";
import { motion } from "framer-motion";

export default function Home() {
  const [, setLocation] = useLocation();
  const [grade, setGrade] = useState<Grade | null>(null);
  const [operation, setOperation] = useState<Operation | null>(null);

  const startQuiz = () => {
    if (grade && operation) {
      setLocation(`/quiz?grade=${grade}&operation=${operation}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-100 to-blue-100 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="container mx-auto px-4"
      >
        <h1 className="text-4xl font-bold text-center mb-8">Math Quiz Adventure!</h1>
        <Card className="max-w-2xl mx-auto">
          <CardContent className="p-8">
            <h2 className="text-2xl font-semibold mb-6">Select Your Grade</h2>
            <GradeSelector selectedGrade={grade} onSelect={setGrade} />
            
            <h2 className="text-2xl font-semibold mb-6 mt-12">Choose Operation</h2>
            <OperationSelector selectedOperation={operation} onSelect={setOperation} />

            <div className="mt-12 text-center">
              <Button
                size="lg"
                onClick={startQuiz}
                disabled={!grade || !operation}
                className="text-xl px-8 py-6"
              >
                Start Quiz!
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
