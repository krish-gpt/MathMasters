import { useQuery } from "@tanstack/react-query";
import { getUserAchievements, getAchievements } from "@/lib/api";
import { AchievementCard } from "@/components/achievements/AchievementCard";
import type { AchievementProgress } from "@/types/achievement";
import { motion } from "framer-motion";
import { Trophy } from "lucide-react";

export default function AchievementsPage() {
  // TODO: Replace with actual user ID from auth system
  const userId = 1;

  const { data: achievements } = useQuery({
    queryKey: ["/api/achievements"],
    queryFn: getAchievements,
  });

  const { data: userAchievements } = useQuery({
    queryKey: ["/api/users", userId, "achievements"],
    queryFn: () => getUserAchievements(userId),
  });

  if (!achievements || !userAchievements) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="animate-pulse text-lg sm:text-xl md:text-2xl text-center">
          Loading achievements...
        </div>
      </div>
    );
  }

  const achievementProgress: AchievementProgress[] = achievements.map((achievement) => {
    const userAchievement = userAchievements.find(
      (ua) => ua.achievementId === achievement.id
    );
    return {
      achievement,
      progress: userAchievement?.progress || 0,
      isEarned: (userAchievement?.progress || 0) >= achievement.threshold,
    };
  });

  const earnedCount = achievementProgress.filter((ap) => ap.isEarned).length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-100 to-blue-100 py-4 sm:py-6 md:py-8 lg:py-12">
      <div className="container mx-auto px-3 sm:px-4 md:px-6">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4 sm:space-y-6 mb-6 sm:mb-8 md:mb-10"
        >
          <div className="flex items-center justify-center gap-2 sm:gap-3">
            <Trophy className="h-6 w-6 sm:h-8 sm:w-8 md:h-10 md:w-10 text-primary" />
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">Achievements</h1>
          </div>

          <p className="text-sm sm:text-base md:text-lg">
            You've earned{" "}
            <span className="font-bold text-primary">{earnedCount}</span> out of{" "}
            <span className="font-bold">{achievements.length}</span> achievements!
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 auto-rows-fr"
        >
          {achievementProgress.map((ap, index) => (
            <motion.div
              key={ap.achievement.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <AchievementCard
                achievement={ap}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}