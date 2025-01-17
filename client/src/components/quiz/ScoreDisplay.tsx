import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";

interface ScoreDisplayProps {
  score: number;
  total: number;
}

export function ScoreDisplay({ score, total }: ScoreDisplayProps) {
  const percentage = Math.round((score / total) * 100);

  return (
    <div className="w-full max-w-md mx-auto p-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-2"
      >
        <span className="text-2xl font-bold">Score: {score}/{total}</span>
      </motion.div>
      <Progress value={percentage} className="h-4" />
    </div>
  );
}
