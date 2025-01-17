import { motion } from "framer-motion";
import confetti from "canvas-confetti";

interface CelebrationEffectProps {
  show: boolean;
}

export function CelebrationEffect({ show }: CelebrationEffectProps) {
  if (!show) return null;

  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onAnimationStart={triggerConfetti}
      className="fixed inset-0 pointer-events-none"
    >
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 360],
          }}
          transition={{ duration: 1.5 }}
          className="text-6xl"
        >
          🌟
        </motion.div>
      </div>
    </motion.div>
  );
}
