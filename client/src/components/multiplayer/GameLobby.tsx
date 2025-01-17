import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { GradeSelector } from "@/components/quiz/GradeSelector";
import { OperationSelector } from "@/components/quiz/OperationSelector";
import { Grade, Operation } from "@/types/quiz";
import { useMutation } from "@tanstack/react-query";

export function GameLobby() {
  const [, setLocation] = useLocation();
  const [grade, setGrade] = useState<Grade | null>(null);
  const [operation, setOperation] = useState<Operation | null>(null);
  const [roomCode, setRoomCode] = useState("");

  const createRoomMutation = useMutation({
    mutationFn: async () => {
      if (!grade || !operation) throw new Error("Invalid settings");
      
      const response = await fetch("/api/game-rooms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ grade, operation }),
      });
      
      if (!response.ok) throw new Error("Failed to create room");
      return response.json();
    },
    onSuccess: (data) => {
      setLocation(`/multiplayer/room/${data.code}`);
    },
  });

  const joinRoom = async () => {
    if (!roomCode) return;
    
    try {
      const response = await fetch(`/api/game-rooms/${roomCode}`);
      if (!response.ok) throw new Error("Room not found");
      
      setLocation(`/multiplayer/room/${roomCode}`);
    } catch (error) {
      console.error("Failed to join room:", error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto space-y-8"
      >
        <Card>
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold mb-6">Create a Game Room</h2>
            
            <div className="space-y-8">
              <div>
                <h3 className="text-lg font-semibold mb-4">Select Grade</h3>
                <GradeSelector selectedGrade={grade} onSelect={setGrade} />
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">Choose Operation</h3>
                <OperationSelector selectedOperation={operation} onSelect={setOperation} />
              </div>

              <div className="flex justify-center">
                <Button
                  size="lg"
                  onClick={() => createRoomMutation.mutate()}
                  disabled={!grade || !operation || createRoomMutation.isPending}
                >
                  {createRoomMutation.isPending ? "Creating..." : "Create Room"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold mb-6">Join a Game Room</h2>
            
            <div className="flex gap-4">
              <Input
                placeholder="Enter room code"
                value={roomCode}
                onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                className="text-center text-xl uppercase"
                maxLength={6}
              />
              <Button
                size="lg"
                onClick={joinRoom}
                disabled={!roomCode}
              >
                Join Room
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
