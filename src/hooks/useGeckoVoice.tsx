import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";

type GeckoScript = {
  id: string;
  trigger: string; // when this line is used, e.g. "greeting", "all_read", "new_capsule", "idle"
  text: string;
};

type UseGeckoVoiceParams = {
  personalityType: number | null | undefined;
  memoryType: number | null | undefined;
  storyType: number | null | undefined;
};

// ── DUMMY DATA ──────────────────────────────────────────────────────────────
// Replace with a real API call once the backend endpoint is ready.
// Keyed by personalityType so filtering is easy.

const DUMMY_SCRIPTS: Record<number, GeckoScript[]> = {
  // personality_type: 1 — Shy
  1: [
    { id: "shy_greeting_1", trigger: "greeting", text: "...hi." },
    { id: "shy_greeting_2", trigger: "greeting", text: "Oh! You're here." },
    { id: "shy_all_read",   trigger: "all_read",  text: "I think I've read everything... for now." },
    { id: "shy_idle_1",     trigger: "idle",       text: "..." },
    { id: "shy_new_capsule_1", trigger: "new_capsule", text: "Oh. A new one." },
  ],
  // personality_type: 2 — Curious
  2: [
    { id: "cur_greeting_1", trigger: "greeting",    text: "Ooh, what's going on today?" },
    { id: "cur_greeting_2", trigger: "greeting",    text: "There you are! I found some interesting stuff." },
    { id: "cur_all_read",   trigger: "all_read",    text: "I've gone through everything. Fascinating, truly." },
    { id: "cur_idle_1",     trigger: "idle",        text: "I wonder..." },
    { id: "cur_new_capsule_1", trigger: "new_capsule", text: "Oooh, what's this one about?" },
  ],
  // personality_type: 3 — Brave
  3: [
    { id: "brave_greeting_1",    trigger: "greeting",    text: "Let's get into it." },
    { id: "brave_greeting_2",    trigger: "greeting",    text: "Ready when you are." },
    { id: "brave_all_read",      trigger: "all_read",    text: "All caught up. Nothing left to explore — for now." },
    { id: "brave_idle_1",        trigger: "idle",        text: "Bring it on." },
    { id: "brave_new_capsule_1", trigger: "new_capsule", text: "New one. Let's see what you've got." },
  ],
};

const FALLBACK_SCRIPTS: GeckoScript[] = [
  { id: "fallback_greeting_1",    trigger: "greeting",    text: "Hello." },
  { id: "fallback_all_read",      trigger: "all_read",    text: "I've read everything." },
  { id: "fallback_idle_1",        trigger: "idle",        text: "..." },
  { id: "fallback_new_capsule_1", trigger: "new_capsule", text: "Something new." },
];

// ── BACKEND RESPONSE SHAPE (for when you hook this up) ──────────────────────
// GET /users/gecko/voice/?personality_type=3&memory_type=3&story_type=1
//
// [
//   { id: "brave_greeting_1",    trigger: "greeting",    text: "Let's get into it." },
//   { id: "brave_greeting_2",    trigger: "greeting",    text: "Ready when you are." },
//   { id: "brave_all_read",      trigger: "all_read",    text: "All caught up. Nothing left to explore — for now." },
//   { id: "brave_idle_1",        trigger: "idle",        text: "Bring it on." },
//   { id: "brave_new_capsule_1", trigger: "new_capsule", text: "New one. Let's see what you've got." },
// ]
//
// The backend filters by the user's config types and returns only relevant lines,
// so we never pull scripts for personality types the user doesn't have.
// ─────────────────────────────────────────────────────────────────────────────

const useGeckoVoice = ({
  personalityType,
  memoryType,
  storyType,
}: UseGeckoVoiceParams) => {
  const enabled = personalityType != null && memoryType != null && storyType != null;

  // When you have a real endpoint, replace the queryFn with an API call:
  // queryFn: () => fetchGeckoVoice({ personalityType, memoryType, storyType })
  const { data: rawScripts = null } = useQuery({
    queryKey: ["geckoVoice", personalityType, memoryType, storyType],
    queryFn: () => DUMMY_SCRIPTS[personalityType!] ?? FALLBACK_SCRIPTS,
    enabled,
    staleTime: Infinity,
    gcTime: Infinity,
  });

  const scripts = useMemo(() => {
    if (!rawScripts) return null;
    return {
      all: rawScripts,
      byTrigger: rawScripts.reduce<Record<string, GeckoScript[]>>((acc, s) => {
        if (!acc[s.trigger]) acc[s.trigger] = [];
        acc[s.trigger].push(s);
        return acc;
      }, {}),
    };
  }, [rawScripts]);

  return { scripts };
};

export default useGeckoVoice;
