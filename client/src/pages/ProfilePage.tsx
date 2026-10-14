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
  X,
} from "lucide-react";
import { useDualoStore } from "../store/useDualoStore";
import type { UserProfile } from "../types/profile";

const AVAILABLE_SKILLS_CATALOG = [
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
  onOpenPhoneGate: () => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({ onOpenPhoneGate }) => {
  const { profile, updateProfile, streak } = useDualoStore();

  const [isEditing, setIsEditing] = useState(false);
  const [isSavedNotice, setIsSavedNotice] = useState(false);
  const [customSkillInput, setCustomSkillInput] = useState("");
  const [activeMatrixTab, setActiveMatrixTab] = useState<"OFFERED" | "WANTED">("OFFERED");

  // Local Form Buffers
  const [formData, setFormData] = useState<UserProfile>(profile);

  const handleToggleEdit = () => {
    if (isEditing) {
      // Save changes back to global Zustand store
      updateProfile(formData);
      setIsEditing(false);
      setIsSavedNotice(true);
      setTimeout(() => setIsSavedNotice(false), 2500);
    } else {
      setFormData(profile);
      setIsEditing(true);
    }
  };

  const toggleOfferedSkill = (skill: string) => {
    const exists = formData.skillsOffered.includes(skill);
    const updated = exists
      ? formData.skillsOffered.filter((s) => s !== skill)
      : [...formData.skillsOffered, skill];
    setFormData({ ...formData, skillsOffered: updated });
  };

  const toggleWantedSkill = (skill: string) => {
    const exists = formData.skillsWanted.includes(skill);
    const updated = exists
      ? formData.skillsWanted.filter((s) => s !== skill)
      : [...formData.skillsWanted, skill];
    setFormData({ ...formData, skillsWanted: updated });
  };

  const handleAddCustomSkill = (e: React.FormEvent) => {
    e.preventDefault();
    const val = customSkillInput.trim();
    if (!val) return;

    if (activeMatrixTab === "OFFERED" && !formData.skillsOffered.includes(val)) {
      setFormData({ ...formData, skillsOffered: [...formData.skillsOffered, val] });
    } else if (activeMatrixTab === "WANTED" && !formData.skillsWanted.includes(val)) {
      setFormData({ ...formData, skillsWanted: [...formData.skillsWanted, val] });
    }
    setCustomSkillInput("");
  };

  return (
    <div className="w-full space-y-6">
      
      {/* Swiss Modern Top Banner */}
      <header className="border-b-2 border-black pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-3">
        <div>
          <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-black">
            MEMBER_PROFILE<span className="text-[#ff3300]">.</span>
          </h1>
          <span className="font-mono text-xs text-zinc-500 uppercase tracking-widest block mt-0.5">
            [SWAPPABLE_CAPABILITY_MATRIX]
          </span>
        </div>

        <button
          type="button"
          onClick={handleToggleEdit}
          className="font-mono text-xs uppercase tracking-wider bg-black hover:bg-[#ff3300] text-white px-4 py-2 font-bold transition border-2 border-black cursor-pointer flex items-center gap-2 shadow-[3px_3px_0px_0px_#ff3300]"
        >
          {isEditing ? (
            <>
              <Check className="w-4 h-4 stroke-[3]" /> [SAVE_CHANGES]
            </>
          ) : (
            <>
              <Edit3 className="w-4 h-4" /> [EDIT_PROFILE]
            </>
          )}
        </button>
      </header>

      {/* Save Notification Toast */}
      {isSavedNotice && (
        <div className="w-full bg-[#ff3300] text-white font-mono text-xs font-bold p-3 border-2 border-black shadow-[4px_4px_0px_0px_#000000] flex items-center justify-between">
          <span>✓ PROFILE & SKILL MATRIX UPDATED IN LOCAL STORAGE</span>
          <Check className="w-4 h-4 stroke-[3]" />
        </div>
      )}

      {/* 12-Column Responsive Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN (5 Cols on Desktop): User Details & Verification Gate */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Identity Header Card */}
          <section className="bg-[#f5f5f5] border-2 border-black p-5 shadow-[4px_4px_0px_0px_#000000] space-y-4">
            <div className="flex items-start justify-between border-b-2 border-black pb-4">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 bg-black text-white border-2 border-black flex items-center justify-center font-black text-2xl font-mono shadow-[2px_2px_0px_0px_#ff3300]">
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

              {/* Security Verification Badge */}
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

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 gap-3 font-mono text-xs text-center">
              <div className="border-2 border-black p-3 bg-white shadow-[2px_2px_0px_0px_#000000]">
                <span className="text-[10px] text-zinc-500 block uppercase">[CURRENT_STREAK]</span>
                <span className="text-xl font-black text-black flex items-center justify-center gap-1 mt-0.5">
                  <Flame className="w-5 h-5 text-[#ff3300] fill-[#ff3300]" />
                  {streak.currentStreak} DAYS
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

          {/* Details Form Card */}
          <section className="bg-white border-2 border-black p-5 shadow-[4px_4px_0px_0px_#000000] space-y-4 font-mono text-xs">
            <div className="border-b border-black pb-2 flex justify-between items-center">
              <span className="font-bold text-black uppercase tracking-wider">
                [PERSONAL_DETAILS]
              </span>
              <MapPin className="w-4 h-4 text-[#ff3300]" />
            </div>

            <div className="space-y-3.5">
              <div>
                <label className="text-[10px] font-bold text-zinc-500 uppercase block mb-1">
                  [FULL_NAME]
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
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
                    value={formData.headline}
                    onChange={(e) => setFormData({ ...formData, headline: e.target.value })}
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
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
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
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
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

          {/* Security Gate Banner if Unverified */}
          {!profile.isPhoneVerified && (
            <div className="bg-black text-white border-2 border-black p-5 shadow-[4px_4px_0px_0px_#ff3300] space-y-3">
              <div className="flex items-center gap-2">
                <Lock className="w-5 h-5 text-[#ff3300]" />
                <h3 className="font-mono text-sm font-bold uppercase">
                  1:1 CHAT GATE UNVERIFIED
                </h3>
              </div>
              <p className="text-xs text-zinc-300 font-sans font-medium leading-relaxed">
                Your profile is live in the discovery feed, but phone OTP verification is required to send and receive 1:1 barter messages.
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

        </div>

        {/* RIGHT COLUMN (7 Cols on Desktop): Interactive Skill Capability Matrix */}
        <div className="lg:col-span-7 space-y-6">
          
          <section className="bg-white border-2 border-black p-5 sm:p-6 shadow-[4px_4px_0px_0px_#000000] space-y-5">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b-2 border-black pb-3 gap-2 font-mono text-xs">
              <div>
                <span className="font-bold text-black uppercase tracking-wider block">
                  [SKILL_CAPABILITY_MATRIX]
                </span>
                <span className="text-[10px] text-zinc-500">
                  {isEditing ? "Click skills to add/remove from active set" : "Current active skill barter pairings"}
                </span>
              </div>

              <div className="flex gap-1.5 self-start sm:self-auto">
                <button
                  type="button"
                  onClick={() => setActiveMatrixTab("OFFERED")}
                  className={`px-3 py-1 font-bold border border-black cursor-pointer transition ${
                    activeMatrixTab === "OFFERED"
                      ? "bg-[#ff3300] text-white"
                      : "bg-[#f5f5f5] text-black hover:bg-black hover:text-white"
                  }`}
                >
                  TEACHING ({isEditing ? formData.skillsOffered.length : profile.skillsOffered.length})
                </button>
                <button
                  type="button"
                  onClick={() => setActiveMatrixTab("WANTED")}
                  className={`px-3 py-1 font-bold border border-black cursor-pointer transition ${
                    activeMatrixTab === "WANTED"
                      ? "bg-black text-white"
                      : "bg-[#f5f5f5] text-black hover:bg-black hover:text-white"
                  }`}
                >
                  LEARNING ({isEditing ? formData.skillsWanted.length : profile.skillsWanted.length})
                </button>
              </div>
            </div>

            {/* Active Skill Pills Display */}
            <div className="space-y-3">
              <span className="font-mono text-[10px] text-zinc-500 uppercase block">
                {activeMatrixTab === "OFFERED" ? "[CURRENTLY_OFFERING_TO_TEACH]" : "[CURRENTLY_SEEKING_TO_LEARN]"}
              </span>

              <div className="flex flex-wrap gap-2">
                {(activeMatrixTab === "OFFERED"
                  ? isEditing ? formData.skillsOffered : profile.skillsOffered
                  : isEditing ? formData.skillsWanted : profile.skillsWanted
                ).map((skill) => (
                  <span
                    key={`active-${skill}`}
                    className={`font-mono text-xs font-bold px-3 py-1.5 border-2 border-black flex items-center gap-2 shadow-[2px_2px_0px_0px_#000000] ${
                      activeMatrixTab === "OFFERED"
                        ? "bg-[#ff3300] text-white"
                        : "bg-black text-white"
                    }`}
                  >
                    {skill}
                    {isEditing && (
                      <button
                        type="button"
                        onClick={() =>
                          activeMatrixTab === "OFFERED"
                            ? toggleOfferedSkill(skill)
                            : toggleWantedSkill(skill)
                        }
                        className="hover:text-black cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5 stroke-[3]" />
                      </button>
                    )}
                  </span>
                ))}
              </div>
            </div>

            {/* Edit Mode Selection Library */}
            {isEditing && (
              <div className="space-y-4 pt-4 border-t-2 border-black font-mono text-xs">
                <span className="text-[10px] font-bold text-zinc-500 uppercase block">
                  [ADD_FROM_SUGGESTED_CATALOG]
                </span>

                <div className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto pr-1">
                  {AVAILABLE_SKILLS_CATALOG.map((skill) => {
                    const isSelected =
                      activeMatrixTab === "OFFERED"
                        ? formData.skillsOffered.includes(skill)
                        : formData.skillsWanted.includes(skill);
                    return (
                      <button
                        key={`avail-${skill}`}
                        type="button"
                        onClick={() =>
                          activeMatrixTab === "OFFERED"
                            ? toggleOfferedSkill(skill)
                            : toggleWantedSkill(skill)
                        }
                        className={`text-xs px-2.5 py-1.5 border border-black font-bold transition cursor-pointer ${
                          isSelected
                            ? activeMatrixTab === "OFFERED"
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

                {/* Custom Skill Input Form */}
                <form onSubmit={handleAddCustomSkill} className="flex gap-2 pt-2">
                  <input
                    type="text"
                    placeholder="Type custom skill name..."
                    value={customSkillInput}
                    onChange={(e) => setCustomSkillInput(e.target.value)}
                    className="flex-1 bg-[#f5f5f5] border-2 border-black px-3 py-2 font-bold text-black focus:outline-none focus:bg-white text-xs"
                  />
                  <button
                    type="submit"
                    className="bg-black text-white font-bold px-4 py-2 border-2 border-black text-xs uppercase flex items-center gap-1 hover:bg-[#ff3300] cursor-pointer shadow-[2px_2px_0px_0px_#000000]"
                  >
                    <Plus className="w-4 h-4" /> ADD
                  </button>
                </form>
              </div>
            )}

            {/* Capability Match Tip Box */}
            <div className="bg-[#f5f5f5] border-2 border-black p-4 font-mono text-xs space-y-1">
              <span className="font-bold text-black block">[ALGORITHM_TIP]</span>
              <p className="text-zinc-600 font-sans text-xs leading-relaxed">
                Adding diverse skills to your matrix increases your reciprocal match rate in the discovery feed by up to 3x.
              </p>
            </div>

          </section>

        </div>

      </div>

    </div>
  );
};