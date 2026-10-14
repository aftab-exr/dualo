import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Smartphone, 
  Mail, 
  Sparkles, 
  ArrowRight, 
  ArrowLeft, 
  RefreshCw,
  Lock
} from "lucide-react";
import type { AuthStep, AuthMethod, AuthFormData } from "../types/auth";
import { CountrySelector } from "../components/ui/CountrySelector";
import { COUNTRIES, type Country } from "../data/countries";

const POPULAR_SKILLS = [
  "React / Next.js",
  "Node.js & APIs",
  "Figma / UI Design",
  "Python & AI",
  "Tailwind CSS",
  "TypeScript",
  "Video Editing",
  "Copywriting",
  "SEO & Growth",
  "Mobile Apps",
];

export const AuthPage: React.FC = () => {
  const [step, setStep] = useState<AuthStep>("METHOD_SELECT");
  const [direction, setDirection] = useState<number>(1);
  const [country, setCountry] = useState<Country>(COUNTRIES[0]);
  
  const [formData, setFormData] = useState<AuthFormData>({
    method: "GOOGLE",
    email: "",
    phoneNumber: "",
    countryCode: "+1",
    otpCode: "",
    fullName: "",
    skillsOffered: [],
    skillsWanted: [],
    isPhoneVerified: false,
  });

  const updateFormData = (fields: Partial<AuthFormData>) => {
    setFormData((prev: AuthFormData) => ({ ...prev, ...fields }));
  };

  const goToNextStep = (next: AuthStep) => {
    setDirection(1);
    setStep(next);
  };

  const goToPrevStep = (prev: AuthStep) => {
    setDirection(-1);
    setStep(prev);
  };

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 30 : -30,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -30 : 30,
      opacity: 0,
    }),
  };

  return (
    <div className="min-h-[100dvh] bg-white text-black flex flex-col justify-between items-center p-4 md:p-6 font-sans selection:bg-[#ff3300] selection:text-white border-x-2 border-black max-w-lg mx-auto">
      
      {/* Swiss Header Bar */}
      <header className="w-full border-b-2 border-black pb-4 space-y-1">
        <div className="flex items-baseline justify-between">
          <h1 className="text-4xl font-black tracking-tight text-black uppercase">
            DUALO<span className="text-[#ff3300]">.</span>
          </h1>
          <span className="font-mono text-xs uppercase tracking-widest bg-black text-white px-2.5 py-1 font-bold">
            SWISS_GRID_V1
          </span>
        </div>
        <p className="text-xs text-zinc-600 font-medium">
          Two skills, <span className="font-cursive text-xl text-black font-normal">One swap.</span>
        </p>
      </header>

      {/* Auth Card Shell with Visible Grid & Offset Shadow */}
      <main className="w-full bg-white border-2 border-black p-6 md:p-8 my-auto shadow-[6px_6px_0px_0px_#000000] relative overflow-hidden">
        
        {/* Step Indicator Header */}
        <div className="flex justify-between items-center mb-6 border-b-2 border-black pb-4 font-mono text-xs">
          <div className="flex gap-1.5">
            <div className={`h-2 transition-all duration-200 ${step === "METHOD_SELECT" ? "w-8 bg-[#ff3300]" : "w-3 bg-black"}`} />
            <div className={`h-2 transition-all duration-200 ${step === "EMAIL_INPUT" || step === "PHONE_INPUT" || step === "OTP_VERIFY" ? "w-8 bg-[#ff3300]" : "w-3 bg-black"}`} />
            <div className={`h-2 transition-all duration-200 ${step === "PROFILE_SKILLS" ? "w-8 bg-[#ff3300]" : "w-3 bg-black"}`} />
          </div>
          <span className="font-bold uppercase tracking-widest text-[#ff3300]">
            {step === "METHOD_SELECT" && "[01_METHOD_SELECT]"}
            {step === "EMAIL_INPUT" && "[02_EMAIL_AUTH]"}
            {step === "PHONE_INPUT" && "[02_PHONE_AUTH]"}
            {step === "OTP_VERIFY" && "[02_VERIFY_OTP]"}
            {step === "PROFILE_SKILLS" && "[03_PROFILE_MATRIX]"}
          </span>
        </div>

        {/* Animated Form Steps */}
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={step}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.18, ease: "easeOut" }}
          >
            {step === "METHOD_SELECT" && (
              <MethodSelectStep
                onSelectMethod={(method) => {
                  updateFormData({ method });
                  if (method === "GOOGLE") {
                    updateFormData({ 
                      fullName: "Google User", 
                      email: "user@gmail.com",
                      isPhoneVerified: false 
                    });
                    goToNextStep("PROFILE_SKILLS");
                  } else if (method === "EMAIL") {
                    goToNextStep("EMAIL_INPUT");
                  } else if (method === "PHONE") {
                    goToNextStep("PHONE_INPUT");
                  }
                }}
              />
            )}

            {step === "EMAIL_INPUT" && (
              <EmailInputStep
                email={formData.email}
                onChange={(email) => updateFormData({ email })}
                onBack={() => goToPrevStep("METHOD_SELECT")}
                onNext={() => goToNextStep("OTP_VERIFY")}
              />
            )}

            {step === "PHONE_INPUT" && (
              <PhoneInputStep
                country={country}
                onSelectCountry={setCountry}
                phoneNumber={formData.phoneNumber}
                onChange={(phoneNumber) => updateFormData({ phoneNumber })}
                onBack={() => goToPrevStep("METHOD_SELECT")}
                onNext={() => {
                  updateFormData({ isPhoneVerified: true });
                  goToNextStep("OTP_VERIFY");
                }}
              />
            )}

            {step === "OTP_VERIFY" && (
              <OtpVerifyStep
                target={formData.method === "EMAIL" ? formData.email : `${country.prefix} ${formData.phoneNumber}`}
                otpCode={formData.otpCode}
                onChange={(otpCode) => updateFormData({ otpCode })}
                onBack={() => goToPrevStep(formData.method === "EMAIL" ? "EMAIL_INPUT" : "PHONE_INPUT")}
                onNext={() => goToNextStep("PROFILE_SKILLS")}
              />
            )}

            {step === "PROFILE_SKILLS" && (
              <ProfileSkillsStep
                formData={formData}
                updateFormData={updateFormData}
                onBack={() => goToPrevStep("METHOD_SELECT")}
                onSubmit={() => {
                  alert(`Registration Complete! Phone Verified: ${formData.isPhoneVerified ? "YES" : "NO"}`);
                  console.log("Swiss Dualo User Payload:", formData);
                }}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Swiss Footer */}
      <footer className="w-full border-t border-black pt-3 flex justify-between items-center font-mono text-[11px] text-zinc-600 uppercase">
        <span>SWISS_BAUHAUS_STYLE</span>
        <span>NO_DECLARATIVE_BLUFF</span>
      </footer>

    </div>
  );
};

/* ============================================================================
 * STEP 1: METHOD SELECTION
 * ============================================================================ */
interface MethodSelectProps {
  onSelectMethod: (method: AuthMethod) => void;
}

const MethodSelectStep: React.FC<MethodSelectProps> = ({ onSelectMethod }) => {
  return (
    <div className="space-y-4">
      <div className="space-y-1 mb-6 border-l-4 border-[#ff3300] pl-3 py-0.5">
        <h2 className="text-xl font-bold tracking-tight text-black uppercase">
          IDENTIFY YOURSELF
        </h2>
        <p className="text-xs text-zinc-600 font-medium">
          Select authentication stream. Phone OTP required before 1:1 barter.
        </p>
      </div>

      <button
        type="button"
        onClick={() => onSelectMethod("GOOGLE")}
        className="w-full bg-[#ff3300] hover:bg-black text-white font-bold py-3.5 px-4 border-2 border-black flex items-center justify-between text-xs uppercase tracking-wider transition-colors duration-150 cursor-pointer shadow-[3px_3px_0px_0px_#000000] active:translate-x-[1px] active:translate-y-[1px]"
      >
        <span className="flex items-center gap-2">
          <Sparkles className="w-4 h-4" />
          CONTINUE WITH GOOGLE
        </span>
        <ArrowRight className="w-4 h-4" />
      </button>

      <button
        type="button"
        onClick={() => onSelectMethod("EMAIL")}
        className="w-full bg-[#f5f5f5] hover:bg-black hover:text-white text-black font-bold py-3.5 px-4 border-2 border-black flex items-center justify-between text-xs uppercase tracking-wider transition-colors duration-150 cursor-pointer shadow-[3px_3px_0px_0px_#000000]"
      >
        <span className="flex items-center gap-2">
          <Mail className="w-4 h-4" />
          CONTINUE WITH EMAIL
        </span>
        <ArrowRight className="w-4 h-4" />
      </button>

      <button
        type="button"
        onClick={() => onSelectMethod("PHONE")}
        className="w-full bg-white hover:bg-black hover:text-white text-black font-bold py-3.5 px-4 border-2 border-black flex items-center justify-between text-xs uppercase tracking-wider transition-colors duration-150 cursor-pointer shadow-[3px_3px_0px_0px_#000000]"
      >
        <span className="flex items-center gap-2">
          <Smartphone className="w-4 h-4" />
          CONTINUE WITH PHONE
        </span>
        <ArrowRight className="w-4 h-4" />
      </button>

      <div className="pt-2 text-center border-t border-zinc-200">
        <p className="text-[10px] font-mono text-zinc-500 uppercase flex items-center justify-center gap-1.5">
          <Lock className="w-3 h-3 text-[#ff3300]" />
          SECURITY GATE ACTIVE // 1:1 BARTER PROTECTION
        </p>
      </div>
    </div>
  );
};

/* ============================================================================
 * EMAIL INPUT STEP
 * ============================================================================ */
interface EmailInputProps {
  email: string;
  onChange: (val: string) => void;
  onBack: () => void;
  onNext: () => void;
}

const EmailInputStep: React.FC<EmailInputProps> = ({ email, onChange, onBack, onNext }) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.includes("@")) onNext();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <button type="button" onClick={onBack} className="font-mono text-xs text-zinc-600 hover:text-black flex items-center gap-1 uppercase font-bold cursor-pointer">
        <ArrowLeft className="w-3.5 h-3.5" /> [RETURN]
      </button>
      <div className="space-y-1">
        <h2 className="text-lg font-bold tracking-tight uppercase text-black">EMAIL DISCOVERY</h2>
        <p className="text-xs text-zinc-600 font-medium">Enter active email address for verification token.</p>
      </div>
      <input
        type="email"
        autoFocus
        placeholder="alex@domain.com"
        value={email}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-[#f5f5f5] border-2 border-black px-4 py-3 text-sm text-black font-mono placeholder-zinc-400 focus:outline-none focus:bg-white"
        required
      />
      <button
        type="submit"
        disabled={!email.includes("@")}
        className="w-full bg-[#ff3300] hover:bg-black text-white font-bold py-3.5 border-2 border-black text-xs uppercase tracking-wider cursor-pointer disabled:bg-zinc-300 disabled:text-zinc-500 disabled:cursor-not-allowed shadow-[3px_3px_0px_0px_#000000]"
      >
        REQUEST DISPATCH CODE
      </button>
    </form>
  );
};

/* ============================================================================
 * PHONE INPUT STEP
 * ============================================================================ */
interface PhoneInputProps {
  country: Country;
  onSelectCountry: (c: Country) => void;
  phoneNumber: string;
  onChange: (val: string) => void;
  onBack: () => void;
  onNext: () => void;
}

const PhoneInputStep: React.FC<PhoneInputProps> = ({ country, onSelectCountry, phoneNumber, onChange, onBack, onNext }) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (phoneNumber.trim().length >= 8) onNext();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <button type="button" onClick={onBack} className="font-mono text-xs text-zinc-600 hover:text-black flex items-center gap-1 uppercase font-bold cursor-pointer">
        <ArrowLeft className="w-3.5 h-3.5" /> [RETURN]
      </button>
      <div className="space-y-1">
        <h2 className="text-lg font-bold tracking-tight uppercase text-black">MOBILE AUTHENTICATION</h2>
        <p className="text-xs text-zinc-600 font-medium">Phone verification immediately unlocks 1:1 chat rights.</p>
      </div>
      <div className="flex gap-2">
        <CountrySelector selectedCountry={country} onSelect={onSelectCountry} />
        <input
          type="tel"
          autoFocus
          placeholder="(555) 000-0000"
          value={phoneNumber}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-[#f5f5f5] border-2 border-black px-4 py-3 text-sm text-black font-mono focus:outline-none focus:bg-white"
          required
        />
      </div>
      <button
        type="submit"
        disabled={phoneNumber.trim().length < 8}
        className="w-full bg-[#ff3300] hover:bg-black text-white font-bold py-3.5 border-2 border-black text-xs uppercase tracking-wider cursor-pointer disabled:bg-zinc-300 disabled:text-zinc-500 disabled:cursor-not-allowed shadow-[3px_3px_0px_0px_#000000]"
      >
        SEND SMS CODE
      </button>
    </form>
  );
};

/* ============================================================================
 * OTP VERIFICATION STEP
 * ============================================================================ */
interface OtpVerifyProps {
  target: string;
  otpCode: string;
  onChange: (val: string) => void;
  onBack: () => void;
  onNext: () => void;
}

const OtpVerifyStep: React.FC<OtpVerifyProps> = ({ target, otpCode, onChange, onBack, onNext }) => {
  const [timer, setTimer] = useState<number>(30);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const otpArray = Array.from({ length: 6 }, (_, i) => otpCode[i] || "");

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleDigitChange = (index: number, value: string) => {
    const digit = value.substring(value.length - 1);
    const updated = otpArray.slice();
    updated[index] = digit;
    const newCode = updated.join("");
    onChange(newCode);

    if (digit && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
    if (newCode.length === 6) {
      onNext();
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between font-mono text-xs">
        <button type="button" onClick={onBack} className="text-zinc-600 hover:text-black flex items-center gap-1 uppercase font-bold cursor-pointer">
          <ArrowLeft className="w-3.5 h-3.5" /> [RETURN]
        </button>
        <span className="bg-black text-white px-2 py-0.5 font-bold">{target}</span>
      </div>

      <div className="space-y-1">
        <h2 className="text-lg font-bold tracking-tight uppercase text-black">ENTER 6-DIGIT CODE</h2>
        <p className="text-xs text-zinc-600 font-medium">Authentication token sent to recipient address.</p>
      </div>

      <div className="flex justify-between gap-1.5 py-2">
        {otpArray.map((digit, idx) => (
          <input
            key={idx}
            ref={(el) => { inputRefs.current[idx] = el; }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleDigitChange(idx, e.target.value)}
            className="w-10 h-12 text-center text-lg font-mono font-bold bg-[#f5f5f5] border-2 border-black text-black focus:outline-none focus:bg-white focus:border-[#ff3300]"
          />
        ))}
      </div>

      <div className="flex justify-between items-center font-mono text-xs text-zinc-600">
        <span>EXPIRATION_TIMER</span>
        {timer > 0 ? (
          <span className="font-bold text-black">{timer}s</span>
        ) : (
          <button type="button" onClick={() => setTimer(30)} className="text-[#ff3300] font-bold hover:underline flex items-center gap-1 cursor-pointer">
            <RefreshCw className="w-3 h-3" /> RESEND
          </button>
        )}
      </div>

      <button
        type="button"
        onClick={onNext}
        disabled={otpCode.length < 6}
        className="w-full bg-[#ff3300] hover:bg-black text-white font-bold py-3.5 border-2 border-black text-xs uppercase tracking-wider cursor-pointer disabled:bg-zinc-300 disabled:text-zinc-500 shadow-[3px_3px_0px_0px_#000000]"
      >
        VERIFY SECURITY CODE
      </button>
    </div>
  );
};

/* ============================================================================
 * PROFILE & SKILLS STEP
 * ============================================================================ */
interface ProfileSkillsProps {
  formData: AuthFormData;
  updateFormData: (fields: Partial<AuthFormData>) => void;
  onBack: () => void;
  onSubmit: () => void;
}

const ProfileSkillsStep: React.FC<ProfileSkillsProps> = ({ formData, updateFormData, onBack, onSubmit }) => {
  const toggleOffered = (skill: string) => {
    const exists = formData.skillsOffered.includes(skill);
    const updated = exists
      ? formData.skillsOffered.filter((s: string) => s !== skill)
      : [...formData.skillsOffered, skill];
    updateFormData({ skillsOffered: updated });
  };

  const toggleWanted = (skill: string) => {
    const exists = formData.skillsWanted.includes(skill);
    const updated = exists
      ? formData.skillsWanted.filter((s: string) => s !== skill)
      : [...formData.skillsWanted, skill];
    updateFormData({ skillsWanted: updated });
  };

  const isComplete =
    formData.fullName.trim().length > 1 &&
    formData.skillsOffered.length > 0 &&
    formData.skillsWanted.length > 0;

  return (
    <div className="space-y-4">
      <button type="button" onClick={onBack} className="font-mono text-xs text-zinc-600 hover:text-black flex items-center gap-1 uppercase font-bold cursor-pointer">
        <ArrowLeft className="w-3.5 h-3.5" /> [RETURN]
      </button>

      <div className="space-y-1">
        <h2 className="text-lg font-bold tracking-tight uppercase text-black">SKILL MATRIX CONFIGURATION</h2>
        <p className="text-xs text-zinc-600 font-medium">Map capability input against desired output.</p>
      </div>

      <div className="space-y-1">
        <label className="font-mono text-[10px] font-bold text-zinc-500 uppercase tracking-widest block">
          [MEMBER_NAME]
        </label>
        <input
          type="text"
          placeholder="Alex Johnson"
          value={formData.fullName}
          onChange={(e) => updateFormData({ fullName: e.target.value })}
          className="w-full bg-[#f5f5f5] border-2 border-black px-4 py-2.5 text-sm text-black font-mono focus:outline-none focus:bg-white"
        />
      </div>

      {/* Skills Offered Grid */}
      <div className="space-y-1.5">
        <label className="font-mono text-[10px] font-bold text-black uppercase tracking-widest block">
          [OFFERING / CAPABILITY]
        </label>
        <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto pr-1">
          {POPULAR_SKILLS.map((skill) => {
            const active = formData.skillsOffered.includes(skill);
            return (
              <button
                key={`offered-${skill}`}
                type="button"
                onClick={() => toggleOffered(skill)}
                className={`text-xs px-2.5 py-1 font-mono font-bold border border-black transition-all cursor-pointer ${
                  active ? "bg-[#ff3300] text-white" : "bg-[#f5f5f5] text-black hover:bg-black hover:text-white"
                }`}
              >
                {skill}
              </button>
            );
          })}
        </div>
      </div>

      {/* Skills Wanted Grid */}
      <div className="space-y-1.5">
        <label className="font-mono text-[10px] font-bold text-[#ff3300] uppercase tracking-widest block">
          [SEEKING / DESIRED]
        </label>
        <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto pr-1">
          {POPULAR_SKILLS.map((skill) => {
            const active = formData.skillsWanted.includes(skill);
            return (
              <button
                key={`wanted-${skill}`}
                type="button"
                onClick={() => toggleWanted(skill)}
                className={`text-xs px-2.5 py-1 font-mono font-bold border border-black transition-all cursor-pointer ${
                  active ? "bg-black text-white" : "bg-white text-black hover:bg-black hover:text-white"
                }`}
              >
                {skill}
              </button>
            );
          })}
        </div>
      </div>

      <button
        type="button"
        onClick={onSubmit}
        disabled={!isComplete}
        className="w-full bg-[#ff3300] hover:bg-black text-white font-bold py-3.5 border-2 border-black text-xs uppercase tracking-wider cursor-pointer disabled:bg-zinc-300 disabled:text-zinc-500 shadow-[3px_3px_0px_0px_#000000] mt-2"
      >
        INITIALIZE BARTER FEED
      </button>
    </div>
  );
};