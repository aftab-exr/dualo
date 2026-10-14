import type { SkillProfile } from "../types/swipe";

export const MOCK_PROFILES: SkillProfile[] = [
  {
    id: "p1",
    fullName: "Elena Rostova",
    headline: "Senior UI/UX Designer & Design System Architect",
    bio: "Building minimalist interfaces for 6+ years. Looking to learn backend API architecture in Node.js or Go in exchange for Figma design mentorship.",
    skillsOffered: ["Figma / UI Design", "Design Systems", "Prototyping"],
    skillsWanted: ["Node.js & APIs", "TypeScript", "PostgreSQL"],
    location: "Berlin, DE",
    streakDays: 7,
  },
  {
    id: "p2",
    fullName: "Marcus Vance",
    headline: "Full-Stack Engineer & Python Enthusiast",
    bio: "Passionate about AI pipelines and data engineering. Wanting to polish my frontend skills with React and Tailwind CSS.",
    skillsOffered: ["Python & AI", "FastAPI", "PostgreSQL"],
    skillsWanted: ["React / Next.js", "Tailwind CSS"],
    location: "San Francisco, CA",
    streakDays: 12,
  },
  {
    id: "p3",
    fullName: "Sophia Chen",
    headline: "Motion Designer & Video Strategist",
    bio: "I turn static designs into fluid 60fps animations. Looking for someone to teach me basic Webflow or Next.js development.",
    skillsOffered: ["Video Editing", "Motion Graphics", "Framer"],
    skillsWanted: ["React / Next.js", "Webflow"],
    location: "Toronto, CA",
    streakDays: 4,
  },
  {
    id: "p4",
    fullName: "Devon Miller",
    headline: "Growth Marketer & Copywriter",
    bio: "Helped 10+ startups scale landing page conversions. Wanting to learn UI design fundamentals in Figma.",
    skillsOffered: ["Copywriting", "SEO & Growth", "Content Strategy"],
    skillsWanted: ["Figma / UI Design", "UI/UX"],
    location: "London, UK",
    streakDays: 15,
  },
];