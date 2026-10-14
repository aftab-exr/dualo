import React, { useState } from "react";
import { Send, Lock, ArrowLeft, ShieldCheck, Sparkles, CheckCheck } from "lucide-react";
import type { ChatSession, ChatMessage } from "../../types/chat";

interface ChatInterfaceProps {
  session: ChatSession;
  onBack: () => void;
  onUnlockPhone: () => void;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({
  session,
  onBack,
  onUnlockPhone,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>(session.messages);
  const [inputText, setInputText] = useState("");

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !session.isPhoneVerified) return;

    const newMessage: ChatMessage = {
      id: `m-${Date.now()}`,
      senderId: "me",
      text: inputText.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      isMe: true,
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputText("");
  };

  return (
    <div className="min-h-[100dvh] bg-white text-black flex flex-col justify-between items-center p-4 md:p-6 font-sans selection:bg-[#ff3300] selection:text-white border-x-2 border-black max-w-lg mx-auto">
      
      {/* Active Swap Header */}
      <header className="w-full border-b-2 border-black pb-3 space-y-2">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={onBack}
            className="font-mono text-xs text-zinc-600 hover:text-black flex items-center gap-1 uppercase font-bold cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> [BACK_TO_FEED]
          </button>

          <span className={`font-mono text-[10px] font-bold uppercase px-2 py-0.5 border border-black ${
            session.isPhoneVerified ? "bg-[#ff3300] text-white" : "bg-black text-white"
          }`}>
            {session.isPhoneVerified ? "SWAP_ACTIVE" : "SECURITY_LOCKED"}
          </span>
        </div>

        {/* Partner Name & Skill Matrix Bar */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-black uppercase tracking-tight text-black">
              {session.partnerName}
            </h1>
            <p className="font-mono text-[10px] text-zinc-500 uppercase">
              LOCATION // {session.partnerLocation}
            </p>
          </div>

          <div className="w-9 h-9 bg-black text-white border-2 border-black flex items-center justify-center font-bold text-sm font-mono">
            {session.partnerName[0]}
          </div>
        </div>

        {/* Barter Pair Matrix Tag */}
        <div className="grid grid-cols-2 gap-2 font-mono text-[10px] bg-[#f5f5f5] border border-black p-2">
          <div>
            <span className="text-zinc-500 block">[YOU_LEARN]</span>
            <span className="font-bold text-black">• {session.offeredSkill}</span>
          </div>
          <div>
            <span className="text-[#ff3300] block">[YOU_TEACH]</span>
            <span className="font-bold text-black">• {session.wantedSkill}</span>
          </div>
        </div>
      </header>

      {/* Message Feed Area */}
      <main className="w-full my-auto py-4 flex-1 overflow-y-auto space-y-3 relative min-h-[360px] max-h-[500px] pr-1">
        
        {/* Security Gate Overlay if Phone is Unverified */}
        {!session.isPhoneVerified && (
          <div className="absolute inset-0 bg-white/95 backdrop-blur-xs border-2 border-black p-6 flex flex-col justify-center items-center text-center space-y-4 z-20 shadow-[6px_6px_0px_0px_#000000]">
            <div className="w-12 h-12 bg-black text-white border-2 border-black flex items-center justify-center">
              <Lock className="w-6 h-6 text-[#ff3300]" />
            </div>

            <div className="space-y-1">
              <h2 className="text-lg font-black uppercase text-black">
                1:1 CHAT LOCKED
              </h2>
              <p className="text-xs text-zinc-600 font-medium max-w-xs leading-relaxed">
                To prevent bots and spam, phone OTP verification is required before initiating 1:1 skill exchanges.
              </p>
            </div>

            <button
              type="button"
              onClick={onUnlockPhone}
              className="w-full bg-[#ff3300] hover:bg-black text-white font-bold py-3.5 border-2 border-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-[3px_3px_0px_0px_#000000]"
            >
              <ShieldCheck className="w-4 h-4" />
              VERIFY PHONE TO UNLOCK CHAT
            </button>
          </div>
        )}

        {/* Timestamped Message Bubbles */}
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col max-w-[80%] space-y-1 ${
              msg.isMe ? "ml-auto items-end" : "mr-auto items-start"
            }`}
          >
            <div
              className={`p-3 border-2 border-black font-sans text-xs leading-relaxed font-medium shadow-[2px_2px_0px_0px_#000000] ${
                msg.isMe
                  ? "bg-[#ff3300] text-white"
                  : "bg-[#f5f5f5] text-black"
              }`}
            >
              {msg.text}
            </div>

            <div className="flex items-center gap-1 font-mono text-[9px] text-zinc-500 uppercase">
              <span>{msg.timestamp}</span>
              {msg.isMe && <CheckCheck className="w-3 h-3 text-black" />}
            </div>
          </div>
        ))}
      </main>

      {/* Swiss Modern Message Input Footer */}
      <footer className="w-full border-t-2 border-black pt-3">
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <input
            type="text"
            disabled={!session.isPhoneVerified}
            placeholder={
              session.isPhoneVerified
                ? "Type message..."
                : "Unlock chat above to send messages..."
            }
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="flex-1 bg-[#f5f5f5] border-2 border-black px-4 py-3 text-xs text-black font-mono focus:outline-none focus:bg-white disabled:bg-zinc-200 disabled:cursor-not-allowed"
          />

          <button
            type="submit"
            disabled={!session.isPhoneVerified || !inputText.trim()}
            className="bg-[#ff3300] hover:bg-black text-white font-bold px-4 border-2 border-black flex items-center justify-center transition cursor-pointer disabled:bg-zinc-300 disabled:text-zinc-500 disabled:cursor-not-allowed shadow-[3px_3px_0px_0px_#000000]"
            aria-label="Send Message"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

        <div className="flex justify-between items-center font-mono text-[9px] text-zinc-500 uppercase mt-2">
          <span className="flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-[#ff3300]" /> P2P_ENCRYPTED
          </span>
          <span>DUALO_CHAT_V1</span>
        </div>
      </footer>

    </div>
  );
};