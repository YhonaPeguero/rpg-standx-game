"use client";

type GrowthTreeProps = {
  completedChapterIds: Set<string>;
  currentChapterId: string;
};

const nodes = [
  { id: "act1-c1-awakening", label: "C1", x: 42, y: 128 },
  { id: "act1-c2-discord-plaza", label: "C2", x: 142, y: 96 },
  { id: "act1-c3-event-arena", label: "C3", x: 242, y: 72 },
  { id: "act1-c4-content-district", label: "C4", x: 342, y: 60 },
  { id: "act1-c5-moderator-gate", label: "C5", x: 442, y: 82 },
  { id: "act1-c6-seed-hall", label: "C6", x: 542, y: 122 },
] as const;

export function GrowthTree({ completedChapterIds, currentChapterId }: GrowthTreeProps) {
  return (
    <div className="sx-panel rounded-sx-lg p-5" id="growth">
      <svg className="h-48 w-full" viewBox="0 0 584 180" role="img" aria-label="Act I growth tree">
        <path d="M42 128 C160 70 270 42 542 122" fill="none" stroke="rgba(0,232,50,0.25)" strokeWidth="6" />
        {nodes.map((node) => {
          const complete = completedChapterIds.has(node.id);
          const current = currentChapterId === node.id;

          return (
            <g key={node.id}>
              <circle
                cx={node.x}
                cy={node.y}
                fill={complete ? "var(--green-primary)" : current ? "var(--gold)" : "var(--text-faint)"}
                opacity={complete || current ? 1 : 0.7}
                r={current ? 18 : 14}
              />
              {current ? <circle cx={node.x} cy={node.y} fill="none" r="26" stroke="var(--gold)" strokeOpacity="0.4" strokeWidth="2" /> : null}
              <text x={node.x} y={node.y + 4} textAnchor="middle" className="fill-sx-bg font-mono text-[11px] font-bold">
                {node.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
