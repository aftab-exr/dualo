import React from "react";
import { 
  ArrowRight, 
  Sparkles, 
  Repeat, 
  ArrowUpRight,
} from "lucide-react";

interface LandingPageProps {
  onGetStarted: () => void;
  onExploreFeed: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onGetStarted,
  onExploreFeed,
}) => {
  return (
    <div className="min-h-[100dvh] bg-white text-black flex flex-col justify-between items-center p-4 md:p-8 font-sans selection:bg-[#ff3300] selection:text-white border-x-2 border-black max-w-4xl mx-auto">
      
      {/* Swiss Navigation Bar */}
      <header className="w-full border-b-2 border-black pb-4 flex items-center justify-between">
        <div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight text-black uppercase">
            DUALO<span className="text-[#ff3300]">.</span>
          </h1>
          <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest block">
            [SKILL_BARTER_PROTOCOL_V1]
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onExploreFeed}
            className="font-mono text-xs uppercase font-bold text-black hover:text-[#ff3300] px-3 py-1.5 border border-black cursor-pointer hidden sm:block"
          >
            [PREVIEW_FEED]
          </button>
          <button
            type="button"
            onClick={onGetStarted}
            className="bg-[#ff3300] hover:bg-black text-white font-bold py-2 px-4 border-2 border-black text-xs uppercase tracking-wider transition cursor-pointer shadow-[3px_3px_0px_0px_#000000] active:translate-x-[1px] active:translate-y-[1px]"
          >
            START SWAPPING
          </button>
        </div>
      </header>

      {/* HERO SECTION: Asymmetric Swiss Layout */}
      <section className="w-full my-8 space-y-6">
        <div className="space-y-3 border-l-4 border-[#ff3300] pl-4 md:pl-6 py-1">
          <div className="inline-flex items-center gap-2 bg-black text-white px-3 py-1 font-mono text-[11px] font-bold uppercase">
            <Sparkles className="w-3.5 h-3.5 text-[#ff3300]" />
            <span>RECIPROCAL PEER-TO-PEER LEARNING</span>
          </div>

          <h2 className="text-4xl sm:text-6xl md:text-7xl font-black uppercase tracking-tight leading-[0.95] text-black">
            TWO SKILLS<span className="text-[#ff3300]">.</span><br />
            <span className="font-cursive text-5xl sm:text-7xl md:text-8xl font-normal normal-case text-black">
              One swap.
            </span>
          </h2>

          <p className="text-sm md:text-base font-medium text-zinc-700 max-w-xl leading-relaxed pt-2">
            No money. No token inflation. Trade your expertise in React, UI Design, or Copywriting directly with peers who teach what you need next.
          </p>
        </div>

        {/* Action Button Row */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            type="button"
            onClick={onGetStarted}
            className="bg-[#ff3300] hover:bg-black text-white font-bold py-4 px-6 border-2 border-black text-sm uppercase tracking-wider flex items-center justify-center gap-3 transition cursor-pointer shadow-[5px_5px_0px_0px_#000000] active:translate-x-[2px] active:translate-y-[2px]"
          >
            CREATE FREE ACCOUNT
            <ArrowRight className="w-5 h-5" />
          </button>

          <button
            type="button"
            onClick={onExploreFeed}
            className="bg-[#f5f5f5] hover:bg-black hover:text-white text-black font-mono text-xs font-bold py-4 px-6 border-2 border-black uppercase tracking-wider flex items-center justify-center gap-2 transition cursor-pointer shadow-[5px_5px_0px_0px_#000000]"
          >
            EXPLORE LIVE DECK
            <ArrowUpRight className="w-4 h-4 text-[#ff3300]" />
          </button>
        </div>
      </section>

      {/* METRICS & PROOF BAR */}
      <section className="w-full grid grid-cols-2 md:grid-cols-4 gap-2 my-4 font-mono">
        <div className="border-2 border-black p-3.5 bg-white shadow-[3px_3px_0px_0px_#000000]">
          <span className="text-[10px] text-zinc-500 uppercase block">[ZERO_COST]</span>
          <span className="text-lg font-black text-black">$0 FEES EVER</span>
        </div>
        <div className="border-2 border-black p-3.5 bg-white shadow-[3px_3px_0px_0px_#000000]">
          <span className="text-[10px] text-zinc-500 uppercase block">[DAILY_SWIPES]</span>
          <span className="text-lg font-black text-black">10 FREE / DAY</span>
        </div>
        <div className="border-2 border-black p-3.5 bg-white shadow-[3px_3px_0px_0px_#000000]">
          <span className="text-[10px] text-[#ff3300] uppercase block">[SECURITY_GATE]</span>
          <span className="text-lg font-black text-black">PHONE OTP 1:1</span>
        </div>
        <div className="border-2 border-black p-3.5 bg-[#ff3300] text-white shadow-[3px_3px_0px_0px_#000000]">
          <span className="text-[10px] text-white/80 uppercase block">[LOG_REWARD]</span>
          <span className="text-lg font-black">+5 EXTRA SWIPES</span>
        </div>
      </section>

      {/* HOW IT WORKS: Asymmetric 3-Step Matrix */}
      <section className="w-full my-8 space-y-4">
        <div className="border-b-2 border-black pb-2 flex items-center justify-between font-mono text-xs">
          <span className="font-bold text-black uppercase tracking-wider">
            [PROTOCOL_WORKFLOW]
          </span>
          <span className="text-zinc-500">3-STEP EXECUTION</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Step 1 */}
          <div className="bg-[#f5f5f5] border-2 border-black p-5 shadow-[4px_4px_0px_0px_#000000] space-y-3">
            <div className="w-8 h-8 bg-black text-white font-mono font-bold flex items-center justify-center border border-black">
              01
            </div>
            <h3 className="text-lg font-black uppercase text-black">MAP YOUR MATRIX</h3>
            <p className="text-xs text-zinc-700 font-medium leading-relaxed">
              Select what skills you bring (e.g. React, Tailwind) and what capabilities you want to learn next.
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-white border-2 border-black p-5 shadow-[4px_4px_0px_0px_#000000] space-y-3">
            <div className="w-8 h-8 bg-[#ff3300] text-white font-mono font-bold flex items-center justify-center border border-black">
              02
            </div>
            <h3 className="text-lg font-black uppercase text-black">SWIPE & MATCH</h3>
            <p className="text-xs text-zinc-700 font-medium leading-relaxed">
              Review candidate decks. Swipe right to propose a reciprocal barter. Instant match when mutual interest exists.
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-[#f5f5f5] border-2 border-black p-5 shadow-[4px_4px_0px_0px_#000000] space-y-3">
            <div className="w-8 h-8 bg-black text-white font-mono font-bold flex items-center justify-center border border-black">
              03
            </div>
            <h3 className="text-lg font-black uppercase text-black">VERIFY & BARTER</h3>
            <p className="text-xs text-zinc-700 font-medium leading-relaxed">
              Complete quick SMS OTP verification to unlock 1:1 chat, log daily learning updates, and earn bonus swipes.
            </p>
          </div>
        </div>
      </section>

      {/* SAMPLE BARTER CARD PREVIEW */}
      <section className="w-full my-6 bg-white border-2 border-black p-6 shadow-[6px_6px_0px_0px_#000000] space-y-4">
        <div className="flex justify-between items-center border-b-2 border-black pb-3 font-mono text-xs">
          <span className="font-bold uppercase text-black flex items-center gap-1.5">
            <Repeat className="w-4 h-4 text-[#ff3300]" /> LIVE_MATCH_SAMPLE
          </span>
          <span className="bg-[#ff3300] text-white px-2 py-0.5 font-bold">100% MUTUAL</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border border-black p-4 bg-[#f5f5f5]">
            <span className="font-mono text-[9px] text-zinc-500 uppercase block">[PARTNER_A]</span>
            <h4 className="font-black text-base uppercase text-black">ELENA ROSTOVA</h4>
            <div className="mt-2 space-y-1 font-mono text-xs">
              <div className="text-black font-bold">• TEACHES: Figma / UI Design</div>
              <div className="text-[#ff3300] font-bold">• WANTS: Node.js & APIs</div>
            </div>
          </div>

          <div className="border border-black p-4 bg-white">
            <span className="font-mono text-[9px] text-zinc-500 uppercase block">[YOU]</span>
            <h4 className="font-black text-base uppercase text-black">ALEX JOHNSON</h4>
            <div className="mt-2 space-y-1 font-mono text-xs">
              <div className="text-black font-bold">• TEACHES: Node.js & APIs</div>
              <div className="text-[#ff3300] font-bold">• WANTS: Figma / UI Design</div>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CALL TO ACTION */}
      <section className="w-full bg-black text-white border-2 border-black p-8 my-8 shadow-[8px_8px_0px_0px_#ff3300] text-center space-y-5">
        <div className="inline-block bg-[#ff3300] text-white font-mono text-[10px] font-bold uppercase px-3 py-1">
          ZERO RISK // ZERO FEES
        </div>

        <h3 className="text-3xl sm:text-5xl font-black uppercase tracking-tight">
          READY TO SWAP YOUR FIRST SKILL?
        </h3>

        <p className="text-xs md:text-sm text-zinc-300 max-w-md mx-auto font-medium leading-relaxed">
          Join Dualo today. Verify your phone when you're ready to chat, log your progress, and build your daily learning streak.
        </p>

        <button
          type="button"
          onClick={onGetStarted}
          className="bg-white hover:bg-[#ff3300] hover:text-white text-black font-bold py-4 px-8 border-2 border-white text-sm uppercase tracking-wider inline-flex items-center justify-center gap-3 transition cursor-pointer shadow-[4px_4px_0px_0px_#ff3300]"
        >
          JOIN DUALO NOW
          <ArrowRight className="w-5 h-5" />
        </button>
      </section>

      {/* Swiss Footer */}
      <footer className="w-full border-t-2 border-black pt-4 flex flex-col sm:flex-row justify-between items-center font-mono text-[11px] text-zinc-600 uppercase gap-2">
        <span>DUALO_SWISS_MODERN_V1</span>
        <span>TWO SKILLS, ONE SWAP.</span>
      </footer>

    </div>
  );
};