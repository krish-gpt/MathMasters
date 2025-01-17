import { useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GradeSelector } from "@/components/quiz/GradeSelector";
import { OperationSelector } from "@/components/quiz/OperationSelector";
import { Grade, Operation } from "@/types/quiz";
import { motion } from "framer-motion";
import { Users, BarChart, Trophy } from "lucide-react";

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
        <div className="grid gap-8 max-w-2xl mx-auto">
          <Card>
            <CardContent className="p-8">
              <h2 className="text-2xl font-semibold mb-6">Play Solo</h2>
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

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-8">
                <h2 className="text-2xl font-semibold mb-6">Play with Friends</h2>
                <div className="text-center">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      size="lg"
                      onClick={() => setLocation("/multiplayer")}
                      className="text-xl px-8 py-6"
                      variant="secondary"
                    >
                      <Users className="mr-2 h-5 w-5" />
                      Multiplayer Mode
                    </Button>
                  </motion.div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-8">
                <h2 className="text-2xl font-semibold mb-6">Track Progress</h2>
                <div className="text-center">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      size="lg"
                      onClick={() => setLocation("/analytics")}
                      className="text-xl px-8 py-6"
                      variant="outline"
                    >
                      <BarChart className="mr-2 h-5 w-5" />
                      View Analytics
                    </Button>
                  </motion.div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-8">
                <h2 className="text-2xl font-semibold mb-6">Achievements</h2>
                <div className="text-center">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      size="lg"
                      onClick={() => setLocation("/achievements")}
                      className="text-xl px-8 py-6"
                      variant="outline"
                    >
                      <Trophy className="mr-2 h-5 w-5" />
                      View Achievements
                    </Button>
                  </motion.div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </motion.div>
    </div>
  );
}