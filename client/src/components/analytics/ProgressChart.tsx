import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { Card, CardContent } from "@/components/ui/card";
import { QuizResult } from "@/types/quiz";
import { format } from "date-fns";

interface ProgressChartProps {
  results: QuizResult[];
  operation: string;
}

export function ProgressChart({ results, operation }: ProgressChartProps) {
  const data = results
    .filter(result => result.operation === operation)
    .map(result => ({
      date: format(new Date(result.createdAt), "MMM d"),
      score: (result.score / result.questionsAttempted) * 100,
    }))
    .reverse();

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold mb-4">{operation.charAt(0).toUpperCase() + operation.slice(1)} Progress</h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis domain={[0, 100]} unit="%" />
              <Tooltip
                formatter={(value: number) => [`${value.toFixed(1)}%`, "Score"]}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="score"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
                name="Score"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
