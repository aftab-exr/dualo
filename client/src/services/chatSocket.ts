import { getAuthToken } from './api';

const WS_BASE_URL = import.meta.env.VITE_WS_BASE_URL || 'ws://localhost:8000/api/v1';

export class ChatWebSocketService {
  private socket: WebSocket | null = null;

  async connect(matchId: string, onMessageReceived: (msg: any) => void) {
    const token = await getAuthToken();
    if (!token) throw new Error("No authentication token found");

    const wsUrl = `${WS_BASE_URL}/chat/ws/${matchId}?token=${encodeURIComponent(token)}`;
    this.socket = new WebSocket(wsUrl);

    this.socket.onopen = () => {
      console.log(`Connected to chat match: ${matchId}`);
    };

    this.socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      onMessageReceived(data);
    };

    this.socket.onerror = (error) => {
      console.error("WebSocket Error:", error);
    };

    this.socket.onclose = () => {
      console.log(`Disconnected from match: ${matchId}`);
    };
  }

  sendMessage(text: string) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify({ text }));
    } else {
      console.error("WebSocket is not connected");
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
  }
}