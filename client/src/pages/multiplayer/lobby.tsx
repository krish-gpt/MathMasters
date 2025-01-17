import { GameLobby } from "@/components/multiplayer/GameLobby";

export default function MultiplayerLobbyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-100 to-blue-100 py-12">
      <h1 className="text-4xl font-bold text-center mb-8">Math Quiz Multiplayer</h1>
      <GameLobby />
    </div>
  );
}
