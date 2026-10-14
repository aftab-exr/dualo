import React, { useState } from "react";
import { 
  ShieldCheck, 
  Flame, 
  Sparkles, 
  Edit3, 
  Check, 
  MapPin, 
  Lock, 
  ArrowRight,
  Plus,
  X
} from "lucide-react";
import type { UserProfile } from "../types/profile";

const AVAILABLE_SKILLS = [
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
  "PostgreSQL",
  "Docker & DevOps"
];

interface ProfilePageProps {
  initialProfile?: UserProfile;
  onOpenPhoneGate: () => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({
  initialProfile,
  onOpenPhoneGate,
}) => {
  const [profile, setProfile] = useState<UserProfile>(
    initialProfile || {
      id: "usr_me",
      fullName: "Alex Johnson",
      handle: "@alex_swapper",
      headline: "Frontend Lead & Creative Technologist",
      bio: "Building Dualo in Swiss Modern style. Looking to trade React & TypeScript knowledge for backend architecture and PostgreSQL design.",
      location: "San Francisco, CA",
      phoneNumber: "+1 (555) 019-2834",
      isPhoneVerified: false,
      streakDays: 7,
      totalSwaps: 12,
      skillsOffered: ["React / Next.js", "TypeScript", "Tailwind CSS"],
      skillsWanted: ["Node.js & APIs", "PostgreSQL", "Docker & DevOps"],
    }
  );

  const [isEditing, setIsEditing] = useState(false);
  const [isSavedNotice, setIsSavedNotice] = useState(false);
  const [customSkillInput, setCustomSkillInput] = useState("");
  const [activeTab, setActiveTab] = useState<"OFFERED" | "WANTED">("OFFERED");

  const handleSave = () => {
    setIsEditing(false);
    setIsSavedNotice(true);
    setTimeout(() => setIsSavedNotice(false), 2500);
  };

  const toggleOfferedSkill = (skill: string) => {
    const exists = profile.skillsOffered.includes(skill);
    const updated = exists
      ? profile.skillsOffered.filter((s) => s !== skill)
      : [...profile.skillsOffered, skill];
    setProfile({ ...profile, skillsOffered: updated });
  };

  const toggleWantedSkill = (skill: string) => {
    const exists = profile.skillsWanted.includes(skill);
    const updated = exists
      ? profile.skillsWanted.filter((s) => s !== skill)
      : [...profile.skillsWanted, skill];
    setProfile({ ...profile, skillsWanted: updated });
  };

  const handleAddCustomSkill = (e: React.FormEvent) => {
    e.preventDefault();
    const val = customSkillInput.trim();
    if (!val) return;

    if (activeTab === "OFFERED" && !profile.skillsOffered.includes(val)) {
      setProfile({ ...profile, skillsOffered: [...profile.skillsOffered, val] });
    } else if (activeTab === "WANTED" && !profile.skillsWanted.includes(val)) {
      setProfile({ ...profile, skillsWanted: [...profile.skillsWanted, val] });
    }
    setCustomSkillInput("");
  };

  return (
    <div className="min-h-[100dvh] bg-white text-black flex flex-col justify-between items-center p-4 md:p-6 font-sans selection:bg-[#ff3300] selection:text-white border-x-2 border-black max-w-lg mx-auto">
      
      {/* Swiss Modern Header Bar */}
      <header className="w-full border-b-2 border-black pb-4 space-y-1">
        <div className="flex items-baseline justify-between">
          <h1 className="text-3xl font-black tracking-tight text-black uppercase">
            MEMBER_PROFILE<span className="text-[#ff3300]">.</span>
          </h1>
          <button
            type="button"
            onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
            className="font-mono text-xs uppercase tracking-widest bg-black hover:bg-[#ff3300] text-white px-3 py-1 font-bold transition border border-black cursor-pointer flex items-center gap-1.5 shadow-[2px_2px_0px_0px_#ff3300]"
          >
            {isEditing ? (
              <>
                <Check className="w-3.5 h-3.5 stroke-[3]" /> [SAVE_CHANGES]
              </>
            ) : (
              <>
                <Edit3 className="w-3.5 h-3.5" /> [EDIT_PROFILE]
              </>
            )}
          </button>
        </div>
        <p className="text-xs text-zinc-600 font-medium">
          Manage identity, verification gate, and skill capability matrix.
        </p>
      </header>

      {/* Save Notification Toast */}
      {isSavedNotice && (
        <div className="w-full bg-[#ff3300] text-white font-mono text-xs font-bold p-3 border-2 border-black my-2 shadow-[4px_4px_0px_0px_#000000] flex items-center justify-between">
          <span>✓ PROFILE MATRIX UPDATED SUCCESSFULLY</span>
          <Check className="w-4 h-4 stroke-[3]" />
        </div>
      )}

      {/* Main Profile Card Container */}
      <main className="w-full space-y-5 my-4">
        
        {/* User Badge Overview Banner */}
        <section className="bg-[#f5f5f5] border-2 border-black p-5 shadow-[4px_4px_0px_0px_#000000] space-y-4">
          <div className="flex items-start justify-between border-b-2 border-black pb-4">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 bg-black text-white border-2 border-black flex items-center justify-center font-black text-xl font-mono shadow-[2px_2px_0px_0px_#ff3300]">
                {profile.fullName[0]}
              </div>
              <div>
                <h2 className="text-xl font-black uppercase tracking-tight text-black">
                  {profile.fullName}
                </h2>
                <span className="font-mono text-xs text-zinc-500 block">
                  {profile.handle}
                </span>
              </div>
            </div>

            {/* Phone Verification Status Badge */}
            <button
              type="button"
              onClick={() => !profile.isPhoneVerified && onOpenPhoneGate()}
              className={`font-mono text-[10px] font-bold uppercase px-2.5 py-1 border-2 border-black flex items-center gap-1 transition ${
                profile.isPhoneVerified
                  ? "bg-[#ff3300] text-white shadow-[2px_2px_0px_0px_#000000]"
                  : "bg-white text-black hover:bg-black hover:text-white cursor-pointer shadow-[2px_2px_0px_0px_#000000]"
              }`}
            >
              {profile.isPhoneVerified ? (
                <>
                  <ShieldCheck className="w-3.5 h-3.5" /> [VERIFIED]
                </>
              ) : (
                <>
                  <Lock className="w-3.5 h-3.5 text-[#ff3300]" /> [UNVERIFIED]
                </>
              )}
            </button>
          </div>

          {/* Metric Counter Blocks */}
          <div className="grid grid-cols-2 gap-2 font-mono text-xs text-center">
            <div className="border-2 border-black p-3 bg-white shadow-[2px_2px_0px_0px_#000000]">
              <span className="text-[10px] text-zinc-500 block uppercase">[ACTIVE_STREAK]</span>
              <span className="text-xl font-black text-black flex items-center justify-center gap-1 mt-0.5">
                <Flame className="w-5 h-5 text-[#ff3300] fill-[#ff3300]" />
                {profile.streakDays} DAYS
              </span>
            </div>

            <div className="border-2 border-black p-3 bg-white shadow-[2px_2px_0px_0px_#000000]">
              <span className="text-[10px] text-zinc-500 block uppercase">[COMPLETED_SWAPS]</span>
              <span className="text-xl font-black text-black flex items-center justify-center gap-1 mt-0.5">
                <Sparkles className="w-5 h-5 text-black" />
                {profile.totalSwaps} SWAPS
              </span>
            </div>
          </div>
        </section>

        {/* Identity & Bio Details Form */}
        <section className="bg-white border-2 border-black p-5 shadow-[4px_4px_0px_0px_#000000] space-y-4 font-mono text-xs">
          <div className="border-b border-black pb-2 flex justify-between items-center">
            <span className="font-bold text-black uppercase tracking-wider">
              [PERSONAL_DETAILS]
            </span>
            <MapPin className="w-4 h-4 text-[#ff3300]" />
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-[10px] font-bold text-zinc-500 uppercase block mb-1">
                [FULL_NAME]
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={profile.fullName}
                  onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                  className="w-full bg-[#f5f5f5] border-2 border-black px-3 py-2 font-bold text-black focus:outline-none focus:bg-white"
                />
              ) : (
                <p className="font-bold text-black text-sm">{profile.fullName}</p>
              )}
            </div>

            <div>
              <label className="text-[10px] font-bold text-zinc-500 uppercase block mb-1">
                [HEADLINE_ROLE]
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={profile.headline}
                  onChange={(e) => setProfile({ ...profile, headline: e.target.value })}
                  className="w-full bg-[#f5f5f5] border-2 border-black px-3 py-2 font-bold text-black focus:outline-none focus:bg-white"
                />
              ) : (
                <p className="font-semibold text-zinc-800">{profile.headline}</p>
              )}
            </div>

            <div>
              <label className="text-[10px] font-bold text-zinc-500 uppercase block mb-1">
                [LOCATION]
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={profile.location}
                  onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                  className="w-full bg-[#f5f5f5] border-2 border-black px-3 py-2 font-bold text-black focus:outline-none focus:bg-white"
                />
              ) : (
                <p className="font-semibold text-zinc-800">{profile.location}</p>
              )}
            </div>

            <div>
              <label className="text-[10px] font-bold text-zinc-500 uppercase block mb-1">
                [BIO_PITCH]
              </label>
              {isEditing ? (
                <textarea
                  rows={3}
                  value={profile.bio}
                  onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                  className="w-full bg-[#f5f5f5] border-2 border-black p-3 font-sans font-medium text-xs text-black focus:outline-none focus:bg-white resize-none"
                />
              ) : (
                <p className="font-sans font-medium text-xs text-zinc-700 leading-relaxed border-l-2 border-[#ff3300] pl-3 py-0.5">
                  "{profile.bio}"
                </p>
              )}
            </div>
          </div>
        </section>

        {/* Dynamic Skill Matrix Editor Section */}
        <section className="bg-white border-2 border-black p-5 shadow-[4px_4px_0px_0px_#000000] space-y-4">
          <div className="flex items-center justify-between border-b-2 border-black pb-2 font-mono text-xs">
            <span className="font-bold text-black uppercase tracking-wider">
              [SKILL_CAPABILITY_MATRIX]
            </span>
            <div className="flex gap-1">
              <button
                type="button"
                onClick={() => setActiveTab("OFFERED")}
                className={`px-2 py-0.5 font-bold border border-black cursor-pointer ${
                  activeTab === "OFFERED" ? "bg-[#ff3300] text-white" : "bg-[#f5f5f5] text-black"
                }`}
              >
                OFFERING ({profile.skillsOffered.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("WANTED")}
                className={`px-2 py-0.5 font-bold border border-black cursor-pointer ${
                  activeTab === "WANTED" ? "bg-black text-white" : "bg-[#f5f5f5] text-black"
                }`}
              >
                SEEKING ({profile.skillsWanted.length})
              </button>
            </div>
          </div>

          {/* Active Skill Pills Display */}
          <div className="space-y-2">
            <span className="font-mono text-[10px] text-zinc-500 uppercase block">
              {activeTab === "OFFERED" ? "[CURRENTLY_TEACHING]" : "[CURRENTLY_SEEKING]"}
            </span>
            <div className="flex flex-wrap gap-1.5">
              {(activeTab === "OFFERED" ? profile.skillsOffered : profile.skillsWanted).map((skill) => (
                <span
                  key={`active-${skill}`}
                  className={`font-mono text-xs font-bold px-2.5 py-1 border border-black flex items-center gap-1.5 ${
                    activeTab === "OFFERED"
                      ? "bg-[#ff3300] text-white"
                      : "bg-black text-white"
                  }`}
                >
                  {skill}
                  {isEditing && (
                    <button
                      type="button"
                      onClick={() =>
                        activeTab === "OFFERED"
                          ? toggleOfferedSkill(skill)
                          : toggleWantedSkill(skill)
                      }
                      className="hover:text-black cursor-pointer"
                    >
                      <X className="w-3 h-3 stroke-[3]" />
                    </button>
                  )}
                </span>
              ))}
            </div>
          </div>

          {/* Edit Mode Selection Library */}
          {isEditing && (
            <div className="space-y-3 pt-3 border-t border-black font-mono text-xs">
              <span className="text-[10px] text-zinc-500 uppercase block">
                [ADD_FROM_SUGGESTED_CATALOG]
              </span>
              <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto pr-1">
                {AVAILABLE_SKILLS.map((skill) => {
                  const isSelected =
                    activeTab === "OFFERED"
                      ? profile.skillsOffered.includes(skill)
                      : profile.skillsWanted.includes(skill);
                  return (
                    <button
                      key={`avail-${skill}`}
                      type="button"
                      onClick={() =>
                        activeTab === "OFFERED"
                          ? toggleOfferedSkill(skill)
                          : toggleWantedSkill(skill)
                      }
                      className={`text-xs px-2.5 py-1 border border-black font-bold transition cursor-pointer ${
                        isSelected
                          ? activeTab === "OFFERED"
                            ? "bg-[#ff3300] text-white"
                            : "bg-black text-white"
                          : "bg-[#f5f5f5] text-black hover:bg-black hover:text-white"
                      }`}
                    >
                      {isSelected ? "✓ " : "+ "}
                      {skill}
                    </button>
                  );
                })}
              </div>

              {/* Custom Skill Addition Input */}
              <form onSubmit={handleAddCustomSkill} className="flex gap-2 pt-2">
                <input
                  type="text"
                  placeholder="Add custom skill..."
                  value={customSkillInput}
                  onChange={(e) => setCustomSkillInput(e.target.value)}
                  className="flex-1 bg-[#f5f5f5] border border-black px-3 py-1.5 font-bold text-black focus:outline-none focus:bg-white"
                />
                <button
                  type="submit"
                  className="bg-black text-white font-bold px-3 py-1.5 border border-black text-xs uppercase flex items-center gap-1 hover:bg-[#ff3300] cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> ADD
                </button>
              </form>
            </div>
          )}
        </section>

        {/* Security Gate Unlock Banner if Unverified */}
        {!profile.isPhoneVerified && (
          <div className="bg-black text-white border-2 border-black p-5 shadow-[4px_4px_0px_0px_#ff3300] space-y-3">
            <div className="flex items-center gap-2">
              <Lock className="w-5 h-5 text-[#ff3300]" />
              <h3 className="font-mono text-sm font-bold uppercase">
                1:1 CHAT GATE UNVERIFIED
              </h3>
            </div>
            <p className="text-xs text-zinc-300 font-sans font-medium leading-relaxed">
              Your profile is active in the discovery feed, but you cannot send or receive 1:1 chat messages until your phone number is verified.
            </p>
            <button
              type="button"
              onClick={onOpenPhoneGate}
              className="w-full bg-[#ff3300] hover:bg-white hover:text-black text-white font-bold py-3 border-2 border-black font-mono text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition shadow-[3px_3px_0px_0px_#ffffff]"
            >
              COMPLETE PHONE OTP VERIFICATION <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </main>

      {/* Swiss Footer */}
      <footer className="w-full border-t border-black pt-3 flex justify-between items-center font-mono text-[11px] text-zinc-600 uppercase">
        <span>PROFILE_MATRIX_V1</span>
        <span>SWISS_GRID_SYSTEM</span>
      </footer>

    </div>
  );
};