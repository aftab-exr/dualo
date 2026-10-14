import React, { useState } from "react";
import { Lock, ShieldCheck, ArrowRight, X } from "lucide-react";

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
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex justify-center items-center p-4 z-50 font-sans">
      <div className="bg-white border-2 border-black p-6 md:p-8 max-w-sm w-full space-y-5 shadow-[8px_8px_0px_0px_#ff3300] relative text-black">
        
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1 hover:bg-black hover:text-white border border-black transition cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Swiss Modern Header Badge */}
        <div className="w-12 h-12 bg-[#ff3300] text-white border-2 border-black flex items-center justify-center shadow-[3px_3px_0px_0px_#000000]">
          <Lock className="w-6 h-6 stroke-[2.5]" />
        </div>

        <div className="space-y-1">
          <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest block">
            [SECURITY_GATE_ACTIVE]
          </span>
          <h3 className="text-xl font-black uppercase text-black tracking-tight">
            VERIFY PHONE TO UNLOCK CHAT
          </h3>
          <p className="text-xs text-zinc-600 font-medium leading-relaxed">
            To prevent bots and spam, 1:1 skill barters require a verified mobile number via SMS OTP.
          </p>
        </div>

        {step === "PHONE" ? (
          <div className="space-y-3 font-mono text-xs">
            <div>
              <label className="text-[10px] font-bold text-zinc-500 uppercase block mb-1">
                [MOBILE_NUMBER]
              </label>
              <input
                type="tel"
                placeholder="+1 (555) 000-0000"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-[#f5f5f5] border-2 border-black px-4 py-3 text-sm text-black font-mono focus:outline-none focus:bg-white"
              />
            </div>
            <button
              type="button"
              onClick={() => setStep("OTP")}
              disabled={phone.trim().length < 8}
              className="w-full bg-[#ff3300] hover:bg-black text-white font-bold py-3.5 border-2 border-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer disabled:bg-zinc-300 disabled:text-zinc-500 disabled:cursor-not-allowed shadow-[3px_3px_0px_0px_#000000]"
            >
              DISPATCH SMS VERIFICATION
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="space-y-3 font-mono text-xs">
            <div>
              <label className="text-[10px] font-bold text-zinc-500 uppercase block mb-1">
                [ENTER_6_DIGIT_OTP]
              </label>
              <input
                type="text"
                maxLength={6}
                placeholder="123456"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full bg-[#f5f5f5] border-2 border-black px-4 py-3 text-center text-xl tracking-widest font-bold text-black focus:outline-none focus:bg-white"
              />
            </div>
            <button
              type="button"
              onClick={() => {
                onVerified();
                onClose();
              }}
              disabled={otp.length < 6}
              className="w-full bg-[#ff3300] hover:bg-black text-white font-bold py-3.5 border-2 border-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer disabled:bg-zinc-300 disabled:text-zinc-500 disabled:cursor-not-allowed shadow-[3px_3px_0px_0px_#000000]"
            >
              VERIFY & UNLOCK 1:1 CHAT
              <ShieldCheck className="w-4 h-4" />
            </button>
          </div>
        )}

        <button
          type="button"
          onClick={onClose}
          className="w-full font-mono text-xs text-zinc-500 hover:text-black uppercase underline cursor-pointer pt-1 block text-center"
        >
          [CANCEL_AND_RETURN_TO_FEED]
        </button>
      </div>
    </div>
  );
};