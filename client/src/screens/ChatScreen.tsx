import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Send, Circle } from 'lucide-react';
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

    const fetchHistory = async () => {
      try {
        setLoading(true);
        const data = await api.get<Message[]>(`/matches/${matchId}/messages`);
        setMessages(data);
      } catch (err) {
        console.error('FAILED TO LOAD CHAT HISTORY:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();

    const socket = new ChatWebSocketService();
    socketServiceRef.current = socket;

    socket
      .connect(matchId, (newMessage: Message) => {
        setMessages((prev) => [...prev, newMessage]);
      })
      .then(() => setIsConnected(true))
      .catch((err) => {
        console.error('WEBSOCKET CONNECTION ERROR:', err);
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
      <div className="flex items-center justify-center min-h-screen bg-white text-black">
        <div className="w-8 h-8 border-4 border-[#E60023] border-t-transparent rounded-full animate-spin mb-3" />
        <p className="font-modern font-bold text-xs uppercase text-black">LOADING CHAT...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-white text-black max-w-md mx-auto border-x-4 border-black">
      <header className="flex items-center justify-between p-4 bg-white border-b-4 border-black sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/matches')}
            className="p-2 text-black hover:bg-[#F4F4F4] rounded-full border-2 border-black transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="font-cursive text-xl font-extrabold text-[#E60023] leading-none">SKILL BARTER CHAT</h2>
            <div className="flex items-center gap-1.5 text-xs font-modern font-bold uppercase text-black">
              <Circle className={`w-2 h-2 fill-current ${isConnected ? 'text-[#E60023]' : 'text-black'}`} />
              <span>{isConnected ? 'REALTIME CONNECTED' : 'CONNECTING...'}</span>
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 ? (
          <div className="text-center text-black py-10 text-sm font-modern font-bold uppercase">
            NO MESSAGES YET. SAY HELLO TO START TRADING SKILLS!
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
                  className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed font-modern font-bold ${
                    isMe
                      ? 'bg-[#E60023] text-white rounded-br-none shadow-max-black border-2 border-black'
                      : 'bg-black text-white rounded-bl-none shadow-max-red border-2 border-black'
                  }`}
                >
                  {msg.text}
                </div>
                <span className="font-modern text-[10px] uppercase text-black mt-1 px-1">
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

      <form
        onSubmit={handleSend}
        className="p-3 bg-white border-t-4 border-black flex items-center gap-2"
      >
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="TYPE A MESSAGE..."
          className="flex-1 bg-white border-3 border-black rounded-xl px-4 py-3 text-sm font-modern font-bold text-black placeholder-slate-400 focus:outline-none focus:border-[#E60023] transition-colors"
        />
        <button
          type="submit"
          disabled={!inputText.trim() || !isConnected}
          className="p-3 rounded-xl bg-[#E60023] hover:bg-red-dark disabled:opacity-50 text-white transition-all shadow-max-black"
        >
          <Send className="w-5 h-5 stroke-[3]" />
        </button>
      </form>
    </div>
  );
};