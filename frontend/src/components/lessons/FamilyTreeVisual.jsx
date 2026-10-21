import { Users, ArrowDown } from "lucide-react";

/**
 * Interactive ASL Family Tree Visual
 * Illustrates the generational hierarchy and ASL gender rule:
 * - Upper face / Forehead = Male signs (Grandpa, Dad, Brother, Son)
 * - Lower face / Chin = Female signs (Grandma, Mom, Sister, Daughter)
 * - Neutral space = Gender-neutral / Collective signs (Family, Parents, Baby)
 */
export default function FamilyTreeVisual({ onSelectMember, completedIds = new Set() }) {
  const generations = [
    {
      title: "Generation 1 · Grandparents",
      members: [
        { id: "word-grandpa", label: "Grandpa", gender: "male", location: "Forehead", icon: "👴" },
        { id: "word-grandma", label: "Grandma", gender: "female", location: "Chin", icon: "👵" },
      ],
    },
    {
      title: "Generation 2 · Parents",
      members: [
        { id: "word-dad", label: "Dad", gender: "male", location: "Forehead", icon: "👨" },
        { id: "word-parents", label: "Parents", gender: "neutral", location: "Forehead + Chin", icon: "👥" },
        { id: "word-mom", label: "Mom", gender: "female", location: "Chin", icon: "👩" },
      ],
    },
    {
      title: "Generation 3 · Children & Siblings",
      members: [
        { id: "word-brother", label: "Brother", gender: "male", location: "Forehead", icon: "👦" },
        { id: "word-son", label: "Son", gender: "male", location: "Forehead to Baby", icon: "👶" },
        { id: "word-baby", label: "Baby", gender: "neutral", location: "Cradle Chest", icon: "🍼" },
        { id: "word-daughter", label: "Daughter", gender: "female", location: "Chin to Baby", icon: "👧" },
        { id: "word-sister", label: "Sister", gender: "female", location: "Chin", icon: "👧" },
      ],
    },
  ];

  return (
    <div className="mb-6 overflow-hidden rounded-2xl border border-signal/25 bg-gradient-to-b from-signal/[0.08] via-ink/[0.02] to-pulse/[0.06] p-5 backdrop-blur-md">
      {/* Header with ASL Gender Rule Tip */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-signal">
            <Users size={14} /> Interactive Family Tree Guide
          </span>
          <h3 className="mt-1 font-display text-base font-bold text-ink sm:text-lg">
            Tap a family member to practice their sign
          </h3>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-[11px]">
          <span className="rounded-full bg-blue-500/15 px-2.5 py-0.5 font-medium text-blue-400 border border-blue-500/30">
            ♂ Forehead (Male)
          </span>
          <span className="rounded-full bg-pink-500/15 px-2.5 py-0.5 font-medium text-pink-400 border border-pink-500/30">
            ♀ Chin (Female)
          </span>
        </div>
      </div>

      {/* Generations Tree Hierarchy */}
      <div className="mt-5 space-y-4">
        {generations.map((gen, gIdx) => (
          <div key={gen.title} className="flex flex-col items-center">
            {gIdx > 0 && (
              <div className="my-1 flex items-center justify-center text-ink-faint">
                <ArrowDown size={14} className="animate-pulse" />
              </div>
            )}
            <div className="w-full">
              <span className="mb-2 block text-center text-[10px] font-semibold uppercase tracking-wider text-ink-faint">
                {gen.title}
              </span>
              <div className="flex flex-wrap items-center justify-center gap-2.5">
                {gen.members.map((member) => {
                  const isDone = completedIds.has(member.id);
                  let genderBadge = "border-ink/10 bg-ink/5 hover:border-signal/40";
                  if (member.gender === "male") {
                    genderBadge = "border-blue-500/30 bg-blue-500/10 hover:border-blue-400 hover:bg-blue-500/20";
                  } else if (member.gender === "female") {
                    genderBadge = "border-pink-500/30 bg-pink-500/10 hover:border-pink-400 hover:bg-pink-500/20";
                  }

                  return (
                    <button
                      key={member.id}
                      type="button"
                      onClick={() => onSelectMember && onSelectMember(member.id)}
                      className={`group relative flex items-center gap-2 rounded-xl border px-3 py-2 text-left transition-all hover:scale-105 active:scale-95 ${genderBadge}`}
                      title={`Practice ${member.label} (${member.location})`}
                    >
                      <span className="text-base">{member.icon}</span>
                      <div className="flex flex-col">
                        <span className="font-display text-xs font-bold text-ink group-hover:text-signal">
                          {member.label}
                        </span>
                        <span className="text-[9.5px] font-mono text-ink-muted">
                          {member.location}
                        </span>
                      </div>
                      {isDone && (
                        <span className="ml-1 flex h-4 w-4 items-center justify-center rounded-full bg-signal text-void text-[9px] font-bold">
                          ✓
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
