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
    <div className="min-h-screen bg-gradient-to-b from-purple-100 to-blue-100 py-8 sm:py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="container mx-auto px-4 max-w-6xl"
      >
        <h1 className="text-3xl sm:text-4xl font-bold text-center mb-8">Math Quiz Adventure!</h1>

        <div className="grid gap-6 sm:gap-8">
          {/* Main Quiz Card */}
          <Card className="w-full">
            <CardContent className="p-6 sm:p-8">
              <div className="space-y-8 sm:space-y-10">
                <section>
                  <h2 className="text-xl sm:text-2xl font-semibold mb-6">Select Grade Level</h2>
                  <GradeSelector selectedGrade={grade} onSelect={setGrade} />
                </section>

                <section>
                  <h2 className="text-xl sm:text-2xl font-semibold mb-6">Choose Operation</h2>
                  <OperationSelector selectedOperation={operation} onSelect={setOperation} />
                </section>

                <div className="flex justify-center">
                  <Button
                    size="lg"
                    onClick={startQuiz}
                    disabled={!grade || !operation}
                    className="text-lg sm:text-xl px-8 py-6 w-full sm:w-auto"
                  >
                    Start Quiz!
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Additional Features Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            {/* Multiplayer Card */}
            <Card className="h-full">
              <CardContent className="p-6 h-full flex flex-col">
                <h2 className="text-lg sm:text-xl font-semibold mb-4">Play with Friends</h2>
                <div className="flex-1 flex items-center justify-center">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full"
                  >
                    <Button
                      size="lg"
                      onClick={() => setLocation("/multiplayer")}
                      className="w-full py-6"
                      variant="secondary"
                    >
                      <Users className="mr-2 h-5 w-5" />
                      <span className="text-base sm:text-lg">Multiplayer Mode</span>
                    </Button>
                  </motion.div>
                </div>
              </CardContent>
            </Card>

            {/* Analytics Card */}
            <Card className="h-full">
              <CardContent className="p-6 h-full flex flex-col">
                <h2 className="text-lg sm:text-xl font-semibold mb-4">Track Progress</h2>
                <div className="flex-1 flex items-center justify-center">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full"
                  >
                    <Button
                      size="lg"
                      onClick={() => setLocation("/analytics")}
                      className="w-full py-6"
                      variant="outline"
                    >
                      <BarChart className="mr-2 h-5 w-5" />
                      <span className="text-base sm:text-lg">View Analytics</span>
                    </Button>
                  </motion.div>
                </div>
              </CardContent>
            </Card>

            {/* Achievements Card */}
            <Card className="h-full">
              <CardContent className="p-6 h-full flex flex-col">
                <h2 className="text-lg sm:text-xl font-semibold mb-4">Achievements</h2>
                <div className="flex-1 flex items-center justify-center">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full"
                  >
                    <Button
                      size="lg"
                      onClick={() => setLocation("/achievements")}
                      className="w-full py-6"
                      variant="outline"
                    >
                      <Trophy className="mr-2 h-5 w-5" />
                      <span className="text-base sm:text-lg">View Achievements</span>
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