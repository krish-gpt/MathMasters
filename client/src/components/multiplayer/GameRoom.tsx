import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Users, Crown } from "lucide-react";

interface Participant {
  userId: number;
  score: number;
  status: string;
}

interface GameRoomProps {
  roomCode: string;
  userId: number;
}

export function GameRoom({ roomCode, userId }: GameRoomProps) {
  const [gameState, setGameState] = useState<{
    participants: Participant[];
    currentQuestion?: number;
  } | null>(null);
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [, setLocation] = useLocation();

  useEffect(() => {
    const wsUrl = `${window.location.protocol === 'https:' ? 'wss:' : 'ws:'}//${window.location.host}/ws/game`;
    const socket = new WebSocket(wsUrl);

    socket.onopen = () => {
      socket.send(JSON.stringify({
        type: "join",
        roomCode,
        userId,
      }));
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      
      switch (data.type) {
        case "gameState":
          setGameState(data.gameState);
          break;
        case "gameStart":
          setLocation(`/multiplayer/game?roomCode=${roomCode}`);
          break;
        case "error":
          console.error("WebSocket error:", data.message);
          break;
      }
    };

    setWs(socket);

    return () => {
      socket.close();
    };
  }, [roomCode, userId]);

  const handleReady = () => {
    if (ws) {
      ws.send(JSON.stringify({
        type: "ready",
        roomCode,
      }));
    }
  };

  if (!gameState) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-xl">Loading game room...</div>
      </div>
    );
  }

  const isPlayerReady = gameState.participants.find(
    p => p.userId === userId
  )?.status === "ready";

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Game Room: {roomCode}</h2>
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            <span>{gameState.participants.length} players</span>
          </div>
        </div>

        <div className="space-y-4">
          {gameState.participants.map((participant, index) => (
            <motion.div
              key={participant.userId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center justify-between p-4 bg-secondary rounded-lg"
            >
              <div className="flex items-center gap-3">
                {index === 0 && <Crown className="w-5 h-5 text-yellow-500" />}
                <span>Player {participant.userId}</span>
              </div>
              <span className="px-3 py-1 rounded-full bg-primary/10 text-sm">
                {participant.status}
              </span>
            </motion.div>
          ))}
        </div>

        <div className="mt-8 flex justify-center">
          <Button
            size="lg"
            onClick={handleReady}
            disabled={isPlayerReady}
          >
            {isPlayerReady ? "Waiting for others..." : "Ready to Play!"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
