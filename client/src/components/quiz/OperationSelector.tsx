import { Button } from "@/components/ui/button";
import { Operation } from "@/types/quiz";
import { Plus, Minus, X, Divide } from "lucide-react";
import { motion } from "framer-motion";

interface OperationSelectorProps {
  selectedOperation: Operation | null;
  onSelect: (operation: Operation) => void;
}

export function OperationSelector({ selectedOperation, onSelect }: OperationSelectorProps) {
  const operations: { type: Operation; icon: React.ReactNode }[] = [
    { type: "addition", icon: <Plus size={24} /> },
    { type: "subtraction", icon: <Minus size={24} /> },
    { type: "multiplication", icon: <X size={24} /> },
    { type: "division", icon: <Divide size={24} /> },
  ];

  return (
    <div className="flex gap-4 justify-center">
      {operations.map(({ type, icon }) => (
        <motion.div
          key={type}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            variant={selectedOperation === type ? "default" : "outline"}
            onClick={() => onSelect(type)}
            size="lg"
            className="w-24 h-24"
          >
            {icon}
          </Button>
        </motion.div>
      ))}
    </div>
  );
}
