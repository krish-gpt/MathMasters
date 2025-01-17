import { WebSocket, WebSocketServer } from "ws";
import type { Server } from "http";
import { db } from "@db";
import { gameRooms, gameParticipants } from "@db/schema";
import { eq } from "drizzle-orm";

interface GameState {
  roomCode: string;
  participants: {
    userId: number;
    score: number;
    status: string;
  }[];
  currentQuestion?: number;
}

const gameStates = new Map<string, GameState>();
const connections = new Map<WebSocket, { userId: number; roomCode?: string }>();

export function setupWebSocketServer(server: Server) {
  const wss = new WebSocketServer({ server, path: "/ws/game" });

  wss.on("connection", (ws: WebSocket) => {
    ws.on("message", async (message: string) => {
      try {
        const data = JSON.parse(message);
        
        switch (data.type) {
          case "join":
            await handleJoinRoom(ws, data.userId, data.roomCode);
            break;
          case "ready":
            await handlePlayerReady(ws, data.roomCode);
            break;
          case "answer":
            await handlePlayerAnswer(ws, data.roomCode, data.correct);
            break;
          case "leave":
            await handleLeaveRoom(ws);
            break;
        }
      } catch (error) {
        console.error("WebSocket message error:", error);
        ws.send(JSON.stringify({ type: "error", message: "Invalid message format" }));
      }
    });

    ws.on("close", () => handleLeaveRoom(ws));
  });
}

async function handleJoinRoom(ws: WebSocket, userId: number, roomCode: string) {
  const room = await db.query.gameRooms.findFirst({
    where: eq(gameRooms.code, roomCode),
    with: {
      participants: true,
    },
  });

  if (!room) {
    ws.send(JSON.stringify({ type: "error", message: "Room not found" }));
    return;
  }

  // Add participant to the room
  await db.insert(gameParticipants).values({
    gameRoomId: room.id,
    userId,
    status: "waiting",
  });

  connections.set(ws, { userId, roomCode });

  // Initialize or get game state
  let gameState = gameStates.get(roomCode) || {
    roomCode,
    participants: [],
    currentQuestion: 0,
  };

  gameState.participants.push({ userId, score: 0, status: "waiting" });
  gameStates.set(roomCode, gameState);

  // Broadcast updated game state to all participants
  broadcastGameState(roomCode);
}

async function handlePlayerReady(ws: WebSocket, roomCode: string) {
  const connection = connections.get(ws);
  if (!connection || connection.roomCode !== roomCode) return;

  const gameState = gameStates.get(roomCode);
  if (!gameState) return;

  // Update player status
  const participant = gameState.participants.find(p => p.userId === connection.userId);
  if (participant) {
    participant.status = "ready";
  }

  // Check if all players are ready
  const allReady = gameState.participants.every(p => p.status === "ready");
  if (allReady) {
    // Start the game
    await startGame(roomCode);
  } else {
    broadcastGameState(roomCode);
  }
}

async function handlePlayerAnswer(ws: WebSocket, roomCode: string, correct: boolean) {
  const connection = connections.get(ws);
  if (!connection || connection.roomCode !== roomCode) return;

  const gameState = gameStates.get(roomCode);
  if (!gameState) return;

  // Update player score
  const participant = gameState.participants.find(p => p.userId === connection.userId);
  if (participant && correct) {
    participant.score += 1;
  }

  broadcastGameState(roomCode);
}

async function handleLeaveRoom(ws: WebSocket) {
  const connection = connections.get(ws);
  if (!connection || !connection.roomCode) return;

  const gameState = gameStates.get(connection.roomCode);
  if (gameState) {
    gameState.participants = gameState.participants.filter(
      p => p.userId !== connection.userId
    );

    if (gameState.participants.length === 0) {
      gameStates.delete(connection.roomCode);
    } else {
      broadcastGameState(connection.roomCode);
    }
  }

  connections.delete(ws);
}

async function startGame(roomCode: string) {
  const gameState = gameStates.get(roomCode);
  if (!gameState) return;

  // Update game status in database
  await db.update(gameRooms)
    .set({ status: "active", startedAt: new Date() })
    .where(eq(gameRooms.code, roomCode));

  // Update all participants status to playing
  gameState.participants.forEach(p => p.status = "playing");
  
  // Broadcast game start
  broadcastToRoom(roomCode, {
    type: "gameStart",
    gameState,
  });
}

function broadcastGameState(roomCode: string) {
  const gameState = gameStates.get(roomCode);
  if (!gameState) return;

  broadcastToRoom(roomCode, {
    type: "gameState",
    gameState,
  });
}

function broadcastToRoom(roomCode: string, message: any) {
  const messageStr = JSON.stringify(message);
  
  for (const [ws, connection] of connections.entries()) {
    if (connection.roomCode === roomCode) {
      ws.send(messageStr);
    }
  }
}
