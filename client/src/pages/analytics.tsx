import { useQuery } from "@tanstack/react-query";
import { getUserStats } from "@/lib/api";
import { ProgressChart } from "@/components/analytics/ProgressChart";
import { AnalyticsStats } from "@/components/analytics/StatsCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Operation } from "@/types/quiz";

export default function AnalyticsPage() {
  // TODO: Replace with actual user ID from auth system
  const userId = 1;

  const { data: results, isLoading } = useQuery({
    queryKey: ["/api/users", userId, "stats"],
    queryFn: () => getUserStats(userId),
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl">Loading analytics...</div>
      </div>
    );
  }

  if (!results?.length) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-center">
          <p>No quiz results yet!</p>
          <p className="text-muted-foreground mt-2">Complete some quizzes to see your progress.</p>
        </div>
      </div>
    );
  }

  const operations: Operation[] = ["addition", "subtraction", "multiplication", "division"];

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-100 to-blue-100 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-8">Your Progress</h1>

        <div className="mb-8">
          <AnalyticsStats results={results} />
        </div>

        <Tabs defaultValue="addition" className="w-full">
          <TabsList className="grid grid-cols-4 w-full max-w-2xl mx-auto">
            {operations.map((op) => (
              <TabsTrigger key={op} value={op} className="capitalize">
                {op}
              </TabsTrigger>
            ))}
          </TabsList>

          {operations.map((operation) => (
            <TabsContent key={operation} value={operation}>
              <ProgressChart results={results} operation={operation} />
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
}
