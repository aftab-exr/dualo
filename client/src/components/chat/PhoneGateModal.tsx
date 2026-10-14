import React, { useState } from "react";
import { Lock, ShieldCheck, Smartphone, ArrowRight } from "lucide-react";

interface PhoneGateModalProps {
  isOpen: boolean;
  onVerified: () => void;
  onClose: () => void;
}

export const PhoneGateModal: React.FC<PhoneGateModalProps> = ({
  isOpen,
  onVerified,
  onClose,
}) => {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"PHONE" | "OTP">("PHONE");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex justify-center items-center p-4 z-50">
      <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-2xl text-white">
        
        <div className="w-12 h-12 bg-zinc-900 border border-zinc-800 rounded-2xl flex items-center justify-center text-white mx-auto mb-2">
          <Lock className="w-6 h-6 text-zinc-200" />
        </div>

        <div className="text-center space-y-1">
          <h3 className="text-lg font-bold">Verify Phone to Unlock Chat</h3>
          <p className="text-xs text-zinc-400">
            To prevent spam and bots, 1:1 skill barters require a verified mobile number.
          </p>
        </div>

        {step === "PHONE" ? (
          <div className="space-y-3">
            <input
              type="tel"
              placeholder="+1 (555) 000-0000"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-white"
            />
            <button
              type="button"
              onClick={() => setStep("OTP")}
              className="w-full bg-white text-black font-semibold py-3 rounded-xl text-sm flex items-center justify-center gap-2"
            >
              Send Verification SMS
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <input
              type="text"
              maxLength={6}
              placeholder="123456"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-center text-xl tracking-widest text-white focus:outline-none focus:border-white"
            />
            <button
              type="button"
              onClick={() => {
                onVerified();
                onClose();
              }}
              className="w-full bg-white text-black font-semibold py-3 rounded-xl text-sm flex items-center justify-center gap-2"
            >
              Verify & Start Chat
              <ShieldCheck className="w-4 h-4" />
            </button>
          </div>
        )}

        <button
          type="button"
          onClick={onClose}
          className="w-full text-xs text-zinc-500 hover:text-zinc-300 py-1"
        >
          Cancel and return to feed
        </button>
      </div>
    </div>
  );
};