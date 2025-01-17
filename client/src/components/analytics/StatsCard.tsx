import { Card, CardContent } from "@/components/ui/card";
import { QuizResult, Operation } from "@/types/quiz";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { motion } from "framer-motion";

interface StatsCardProps {
  title: string;
  value: string | number;
  trend?: number;
  icon?: React.ReactNode;
}

export function StatsCard({ title, value, trend, icon }: StatsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">{title}</p>
              <h3 className="text-2xl font-bold mt-1">{value}</h3>
            </div>
            {icon && (
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                {icon}
              </div>
            )}
          </div>
          {trend !== undefined && (
            <div className="mt-2 flex items-center gap-1 text-sm">
              {trend > 0 ? (
                <TrendingUp className="h-4 w-4 text-green-500" />
              ) : trend < 0 ? (
                <TrendingDown className="h-4 w-4 text-red-500" />
              ) : (
                <Minus className="h-4 w-4 text-gray-500" />
              )}
              <span
                className={
                  trend > 0
                    ? "text-green-500"
                    : trend < 0
                    ? "text-red-500"
                    : "text-gray-500"
                }
              >
                {Math.abs(trend)}% from last week
              </span>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

interface AnalyticsStatsProps {
  results: QuizResult[];
}

export function AnalyticsStats({ results }: AnalyticsStatsProps) {
  const calculateStats = () => {
    if (!results.length) return null;

    const totalAttempts = results.length;
    const totalCorrect = results.reduce((sum, r) => sum + r.score, 0);
    const totalQuestions = results.reduce((sum, r) => sum + r.questionsAttempted, 0);
    const averageScore = (totalCorrect / totalQuestions) * 100;

    // Calculate weekly trend
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

    const thisWeekResults = results.filter(r => new Date(r.createdAt) >= oneWeekAgo);
    const lastWeekResults = results.filter(
      r => new Date(r.createdAt) >= twoWeeksAgo && new Date(r.createdAt) < oneWeekAgo
    );

    const thisWeekAvg = thisWeekResults.length
      ? thisWeekResults.reduce((sum, r) => sum + (r.score / r.questionsAttempted) * 100, 0) /
        thisWeekResults.length
      : 0;
    const lastWeekAvg = lastWeekResults.length
      ? lastWeekResults.reduce((sum, r) => sum + (r.score / r.questionsAttempted) * 100, 0) /
        lastWeekResults.length
      : 0;

    const trend = lastWeekAvg ? ((thisWeekAvg - lastWeekAvg) / lastWeekAvg) * 100 : 0;

    return {
      totalAttempts,
      averageScore: averageScore.toFixed(1),
      trend: Math.round(trend),
    };
  };

  const stats = calculateStats();

  if (!stats) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <StatsCard
        title="Total Quizzes"
        value={stats.totalAttempts}
      />
      <StatsCard
        title="Average Score"
        value={`${stats.averageScore}%`}
        trend={stats.trend}
      />
    </div>
  );
}
