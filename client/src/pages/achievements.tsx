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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl">Loading achievements...</div>
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
      isEarned: userAchievement?.progress >= achievement.threshold,
    };
  });

  const earnedCount = achievementProgress.filter((ap) => ap.isEarned).length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-100 to-blue-100 py-12">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center gap-4 mb-8">
          <Trophy className="h-8 w-8 text-primary" />
          <h1 className="text-4xl font-bold text-center">Achievements</h1>
        </div>

        <div className="text-center mb-8">
          <p className="text-lg">
            You've earned <span className="font-bold text-primary">{earnedCount}</span> out of{" "}
            <span className="font-bold">{achievements.length}</span> achievements!
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
        >
          {achievementProgress.map((ap) => (
            <AchievementCard
              key={ap.achievement.id}
              achievement={ap}
            />
          ))}
        </motion.div>
      </div>
    </div>
  );
}
