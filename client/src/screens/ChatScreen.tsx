import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Send, Loader2, Circle } from 'lucide-react';
import { api } from '../services/api';
import { ChatWebSocketService } from '../services/chatSocket';
import { useAuthStore } from '../store/useAuthStore';

interface Message {
  id: string;
  matchId: string;
  senderId: string;
  text: string;
  createdAt: string;
}

export const ChatScreen: React.FC = () => {
  const { matchId } = useParams<{ matchId: string }>();
  const navigate = useNavigate();
  const currentUser = useAuthStore((state) => state.user);

  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(false);

  const socketServiceRef = useRef<ChatWebSocketService | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (!matchId) return;

    // 1. Fetch Chat History via REST API
    const fetchHistory = async () => {
      try {
        setLoading(true);
        const data = await api.get<Message[]>(`/matches/${matchId}/messages`);
        setMessages(data);
      } catch (err) {
        console.error('Failed to load chat history:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();

    // 2. Initialize WebSocket Real-Time Listener
    const socket = new ChatWebSocketService();
    socketServiceRef.current = socket;

    socket
      .connect(matchId, (newMessage: Message) => {
        setMessages((prev) => [...prev, newMessage]);
      })
      .then(() => setIsConnected(true))
      .catch((err) => {
        console.error('WebSocket connection error:', err);
        setIsConnected(false);
      });

    return () => {
      socket.disconnect();
      setIsConnected(false);
    };
  }, [matchId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !socketServiceRef.current) return;

    socketServiceRef.current.sendMessage(inputText.trim());
    setInputText('');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-950 text-white">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-slate-950 text-white max-w-md mx-auto border-x border-slate-900">
      {/* Header */}
      <header className="flex items-center justify-between p-4 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/matches')}
            className="p-2 text-slate-400 hover:text-white rounded-full hover:bg-slate-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="font-bold text-white text-base">Skill Barter Chat</h2>
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <Circle
                className={`w-2 h-2 fill-current ${
                  isConnected ? 'text-emerald-500' : 'text-amber-500'
                }`}
              />
              <span>{isConnected ? 'Realtime Connected' : 'Connecting...'}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Messages Feed */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 ? (
          <div className="text-center text-slate-500 py-10 text-sm">
            No messages yet. Say hello to start trading skills!
          </div>
        ) : (
          messages.map((msg) => {
            const isMe = msg.senderId === currentUser?.id;
            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                    isMe
                      ? 'bg-blue-600 text-white rounded-br-none shadow-lg shadow-blue-600/10'
                      : 'bg-slate-800 text-slate-100 rounded-bl-none border border-slate-700/60'
                  }`}
                >
                  {msg.text}
                </div>
                <span className="text-[10px] text-slate-500 mt-1 px-1">
                  {new Date(msg.createdAt).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input Form */}
      <form
        onSubmit={handleSend}
        className="p-3 bg-slate-900 border-t border-slate-800 flex items-center gap-2"
      >
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
        />
        <button
          type="submit"
          disabled={!inputText.trim() || !isConnected}
          className="p-3 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:hover:bg-blue-600 text-white transition-all shadow-md shadow-blue-600/20"
        >
          <Send className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
};