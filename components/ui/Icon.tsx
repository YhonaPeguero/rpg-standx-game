import type { ReactNode, SVGProps } from "react";

export type IconName =
  | "home"
  | "hq"
  | "quests"
  | "ranks"
  | "codex"
  | "profile"
  | "audioOn"
  | "audioOff"
  | "star"
  | "lock"
  | "check"
  | "arrowLeft"
  | "play"
  | "chevronDown"
  | "seed";

// Cohesive line-icon set (24x24, currentColor) so the UI stops relying on
// generic emoji/unicode glyphs. Stroke-based with a couple of filled marks.
const paths: Record<IconName, ReactNode> = {
  home: (
    <>
      <path d="M4 10.5 12 4l8 6.5" />
      <path d="M6 9.8V20h12V9.8" />
    </>
  ),
  hq: (
    <>
      <rect x="3.5" y="4.5" width="17" height="15" rx="2" />
      <path d="M3.5 9.5h17" />
      <path d="M9 9.5V20" />
    </>
  ),
  quests: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="12" cy="12" r="0.75" fill="currentColor" stroke="none" />
    </>
  ),
  ranks: (
    <>
      <path d="M6 13.5l6-5 6 5" />
      <path d="M6 18l6-5 6 5" />
    </>
  ),
  codex: (
    <>
      <path d="M4 5h5.5A2.5 2.5 0 0 1 12 7.5V20a2 2 0 0 0-2-2H4z" />
      <path d="M20 5h-5.5A2.5 2.5 0 0 0 12 7.5V20a2 2 0 0 1 2-2h6z" />
    </>
  ),
  profile: (
    <>
      <circle cx="12" cy="8.5" r="3.5" />
      <path d="M5.5 19.5a6.5 6.5 0 0 1 13 0" />
    </>
  ),
  audioOn: (
    <>
      <path d="M4 9h3l4-3.2v12.4L7 15H4z" />
      <path d="M15.5 9a4 4 0 0 1 0 6" />
      <path d="M18 6.8a7 7 0 0 1 0 10.4" />
    </>
  ),
  audioOff: (
    <>
      <path d="M4 9h3l4-3.2v12.4L7 15H4z" />
      <path d="M16 9.5l4.5 5M20.5 9.5l-4.5 5" />
    </>
  ),
  star: <path d="M12 3.6l2.6 5.27 5.82.85-4.21 4.1.99 5.79L12 16.88l-5.2 2.73.99-5.79-4.21-4.1 5.82-.85z" fill="currentColor" stroke="none" />,
  lock: (
    <>
      <rect x="5" y="10.5" width="14" height="9" rx="2" />
      <path d="M8 10.5V8a4 4 0 0 1 8 0v2.5" />
    </>
  ),
  check: <path d="M5 12.5l4.2 4.3L19 7.2" />,
  arrowLeft: (
    <>
      <path d="M19 12H6" />
      <path d="M11 6l-5 6 5 6" />
    </>
  ),
  play: <path d="M8 5.5v13l11-6.5z" fill="currentColor" stroke="none" />,
  chevronDown: <path d="M6 9.5l6 6 6-6" />,
  seed: (
    <>
      <path d="M12 21v-7" />
      <path d="M12 14c0-3.5 2.5-6 6-6 0 3.5-2.5 6-6 6z" />
      <path d="M12 14c0-3 -2-5.5-5-5.5 0 3 2 5.5 5 5.5z" />
    </>
  ),
};

type IconProps = SVGProps<SVGSVGElement> & {
  name: IconName;
  size?: number;
};

export function Icon({ name, size = 18, className, ...props }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      height={size}
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.75}
      viewBox="0 0 24 24"
      width={size}
      {...props}
    >
      {paths[name]}
    </svg>
  );
}
