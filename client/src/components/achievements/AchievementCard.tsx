import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Trophy } from "lucide-react";
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
    <Card 
      className={`h-full transition-all duration-200 hover:shadow-lg ${
        achievement.isEarned ? "border-2 border-primary" : ""
      }`}
    >
      <CardContent className="p-3 sm:p-4 md:p-5 h-full">
        <div className="flex items-start gap-3 h-full">
          <div className="flex-shrink-0">
            <div className={`
              w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 
              rounded-full 
              bg-primary/10 
              flex items-center justify-center
              transition-all duration-200
              ${achievement.isEarned ? 'scale-110' : ''}
            `}>
              <Trophy 
                className={`
                  w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6
                  ${achievement.isEarned ? 'text-primary' : 'text-muted-foreground'}
                `}
              />
            </div>
          </div>

          <div className="flex-1 min-w-0 space-y-2">
            <div>
              <h3 className="font-bold text-sm sm:text-base md:text-lg truncate">
                {achievement.achievement.name}
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 mt-0.5">
                {achievement.achievement.description}
              </p>
            </div>

            {!achievement.isEarned && (
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs sm:text-sm">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="font-mono">
                    {achievement.progress} / {achievement.achievement.threshold}
                  </span>
                </div>
                <Progress 
                  value={progressPercentage} 
                  className="h-1.5 sm:h-2"
                />
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}