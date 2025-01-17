import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { QuizCard } from "@/components/quiz/QuizCard";
import { ScoreDisplay } from "@/components/quiz/ScoreDisplay";
import { Question } from "@/types/quiz";
import { useQuery } from "@tanstack/react-query";

export default function MultiplayerGamePage() {
  const [, setLocation] = useLocation();
  const searchParams = new URLSearchParams(window.location.search);
  const roomCode = searchParams.get("roomCode");
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [gameState, setGameState] = useState<{
    participants: Array<{ userId: number; score: number; status: string }>;
    currentQuestion?: number;
  } | null>(null);

  const { data: questions } = useQuery({
    queryKey: ["/api/questions", gameState?.grade, gameState?.operation],
    enabled: false, // We'll fetch questions when the game starts
  });

  useEffect(() => {
    if (!roomCode) {
      setLocation("/multiplayer");
      return;
    }

    const wsUrl = `${window.location.protocol === 'https:' ? 'wss:' : 'ws:'}//${window.location.host}/ws/game`;
    const socket = new WebSocket(wsUrl);

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "gameState") {
        setGameState(data.gameState);
      }
    };

    setWs(socket);

    return () => {
      socket.close();
    };
  }, [roomCode]);

  const handleAnswer = (correct: boolean) => {
    if (ws) {
      ws.send(JSON.stringify({
        type: "answer",
        roomCode,
        correct,
      }));
    }
  };

  if (!gameState || !questions) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl">Loading game...</div>
      </div>
    );
  }

  const currentParticipant = gameState.participants.find(p => p.userId === 1); // TODO: Replace with actual user ID
  const currentQuestion = questions[gameState.currentQuestion || 0];

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-100 to-blue-100 py-12">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-center mb-4">Multiplayer Game</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {gameState.participants.map((participant) => (
              <ScoreDisplay
                key={participant.userId}
                score={participant.score}
                total={questions.length}
              />
            ))}
          </div>
        </div>

        {currentQuestion && (
          <QuizCard
            question={currentQuestion}
            onAnswer={handleAnswer}
          />
        )}
      </div>
    </div>
  );
}
