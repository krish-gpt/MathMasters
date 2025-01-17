import { Button } from "@/components/ui/button";
import { Grade } from "@/types/quiz";
import { motion } from "framer-motion";

interface GradeSelectorProps {
  selectedGrade: Grade | null;
  onSelect: (grade: Grade) => void;
}

export function GradeSelector({ selectedGrade, onSelect }: GradeSelectorProps) {
  const grades: Grade[] = [1, 2, 3];

  return (
    <div className="flex gap-4 justify-center">
      {grades.map((grade) => (
        <motion.div
          key={grade}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            variant={selectedGrade === grade ? "default" : "outline"}
            onClick={() => onSelect(grade)}
            size="lg"
            className="w-24 h-24 text-2xl"
          >
            Grade {grade}
          </Button>
        </motion.div>
      ))}
    </div>
  );
}
