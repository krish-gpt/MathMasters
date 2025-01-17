import { GameRoom } from "@/components/multiplayer/GameRoom";
import { useParams } from "wouter";

export default function MultiplayerRoomPage() {
  const { code } = useParams();
  // TODO: Replace with actual user ID from auth system
  const userId = 1;

  if (!code) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl">Invalid room code</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-100 to-blue-100 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-8">Multiplayer Room</h1>
        <GameRoom roomCode={code} userId={userId} />
      </div>
    </div>
  );
}
