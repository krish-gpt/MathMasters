import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Trophy } from "lucide-react";
import { motion } from "framer-motion";
import type { AchievementProgress } from "@/types/achievement";

interface AchievementCardProps {
  achievement: AchievementProgress;
  isNew?: boolean;
}

export function AchievementCard({ achievement, isNew }: AchievementCardProps) {
  const progressPercentage = Math.min(
    100,
    Math.round((achievement.progress / achievement.achievement.threshold) * 100)
  );

  return (
    <motion.div
      initial={isNew ? { scale: 0.8, opacity: 0 } : undefined}
      animate={isNew ? { scale: 1, opacity: 1 } : undefined}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.02 }}
    >
      <Card className={achievement.isEarned ? "border-2 border-primary" : ""}>
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              {achievement.isEarned ? (
                <Trophy className="h-6 w-6 text-primary" />
              ) : (
                <Trophy className="h-6 w-6 text-muted-foreground" />
              )}
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-lg">{achievement.achievement.name}</h3>
              <p className="text-sm text-muted-foreground mb-2">
                {achievement.achievement.description}
              </p>
              {!achievement.isEarned && (
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span>{achievement.progress} / {achievement.achievement.threshold}</span>
                  </div>
                  <Progress value={progressPercentage} className="h-2" />
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
