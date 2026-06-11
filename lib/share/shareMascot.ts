/**
 * Static cheer-pose mascot SVG used to rasterize the share PNG.
 * Mirrors components/mascot/Mascot.tsx geometry (cheer) without React/animation,
 * so it can be loaded as an <img> and drawn onto a canvas.
 */
export function shareMascotSvg(): string {
  const OUTLINE = "#07090c";
  const BODY = "#171c22";
  const GOLD = "#ffd900";
  const spark = "M0 -8 L2 -2 L8 0 L2 2 L0 8 L-2 2 L-8 0 L-2 -2 Z";

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
  <defs>
    <radialGradient id="sm-body" cx="38%" cy="28%" r="80%">
      <stop offset="0%" stop-color="#2c333b"/><stop offset="55%" stop-color="#1a2026"/><stop offset="100%" stop-color="#10141a"/>
    </radialGradient>
    <radialGradient id="sm-iris" cx="40%" cy="32%" r="75%">
      <stop offset="0%" stop-color="#67cf6e"/><stop offset="55%" stop-color="#1f9e42"/><stop offset="100%" stop-color="#0b6325"/>
    </radialGradient>
    <radialGradient id="sm-glow" r="50%">
      <stop offset="0%" stop-color="rgba(0,232,50,0.3)"/><stop offset="100%" stop-color="rgba(0,232,50,0)"/>
    </radialGradient>
    <clipPath id="sm-mouth"><path d="M80 142 Q100 136 120 142 Q118 166 100 168 Q82 166 80 142 Z"/></clipPath>
  </defs>
  <ellipse cx="100" cy="180" rx="52" ry="11" fill="url(#sm-glow)"/>
  <text x="30" y="64" font-family="monospace" font-size="26" font-weight="800" text-anchor="middle" fill="${GOLD}" stroke="#8f6c00" stroke-width="1.4" paint-order="stroke">$</text>
  <text x="172" y="54" font-family="monospace" font-size="23" font-weight="800" text-anchor="middle" fill="${GOLD}" stroke="#8f6c00" stroke-width="1.4" paint-order="stroke">$</text>
  <text x="22" y="132" font-family="monospace" font-size="22" font-weight="800" text-anchor="middle" fill="${GOLD}" stroke="#8f6c00" stroke-width="1.4" paint-order="stroke">$</text>
  <text x="178" y="126" font-family="monospace" font-size="26" font-weight="800" text-anchor="middle" fill="${GOLD}" stroke="#8f6c00" stroke-width="1.4" paint-order="stroke">$</text>
  <g transform="translate(44 30)"><path d="${spark}" fill="${GOLD}" stroke="#8f6c00" stroke-width="1"/></g>
  <g transform="translate(158 24) scale(0.8)"><path d="${spark}" fill="${GOLD}" stroke="#8f6c00" stroke-width="1"/></g>
  <g transform="translate(14 94) scale(0.7)"><path d="${spark}" fill="${GOLD}" stroke="#8f6c00" stroke-width="1"/></g>
  <g transform="translate(186 90) scale(0.8)"><path d="${spark}" fill="${GOLD}" stroke="#8f6c00" stroke-width="1"/></g>
  <g transform="translate(136 12) scale(0.6)"><path d="${spark}" fill="${GOLD}" stroke="#8f6c00" stroke-width="1"/></g>
  <ellipse cx="84" cy="171" rx="9" ry="8" fill="${BODY}" stroke="${OUTLINE}" stroke-width="4"/>
  <ellipse cx="116" cy="171" rx="9" ry="8" fill="${BODY}" stroke="${OUTLINE}" stroke-width="4"/>
  <path d="M62 122 L52 98" fill="none" stroke="${OUTLINE}" stroke-linecap="round" stroke-width="15.5"/>
  <path d="M62 122 L52 98" fill="none" stroke="${BODY}" stroke-linecap="round" stroke-width="10"/>
  <path d="M138 122 L148 98" fill="none" stroke="${OUTLINE}" stroke-linecap="round" stroke-width="15.5"/>
  <path d="M138 122 L148 98" fill="none" stroke="${BODY}" stroke-linecap="round" stroke-width="10"/>
  <path d="M100 66 C103 56 107 47 114 38" fill="none" stroke="${OUTLINE}" stroke-linecap="round" stroke-width="6"/>
  <path d="M114 38 C120 18 142 8 158 12 C156 30 138 44 114 38 Z" fill="#1e7e2f" stroke="${OUTLINE}" stroke-linejoin="round" stroke-width="5"/>
  <path d="M114 38 C120 18 142 8 158 12 C146 16 128 26 114 38 Z" fill="#46b14a"/>
  <path d="M117 36 C128 26 142 18 154 14" fill="none" stroke="#145723" stroke-linecap="round" stroke-width="2.5"/>
  <ellipse cx="100" cy="116" rx="54" ry="52" fill="url(#sm-body)" stroke="${OUTLINE}" stroke-width="7"/>
  <ellipse cx="100" cy="106" rx="30" ry="31" fill="#f2f4e6"/>
  <circle cx="102" cy="107" r="19" fill="url(#sm-iris)"/>
  <circle cx="105" cy="109" r="10" fill="#053015"/>
  <circle cx="92" cy="96" r="6.5" fill="#ffffff"/>
  <path d="M80 142 Q100 136 120 142 Q118 166 100 168 Q82 166 80 142 Z" fill="#140b04" stroke="${OUTLINE}" stroke-linejoin="round" stroke-width="4"/>
  <ellipse cx="100" cy="163" rx="13" ry="7" fill="#ffb000" clip-path="url(#sm-mouth)"/>
  <path d="M55 128 l11 -4 M57 135 l11 -4 M59 142 l11 -4" stroke="#d98545" stroke-linecap="round" stroke-width="3.5"/>
  <path d="M145 124 l-11 -4 M143 131 l-11 -4 M141 138 l-11 -4" stroke="#d98545" stroke-linecap="round" stroke-width="3.5"/>
  <circle cx="56" cy="96" r="9" fill="${BODY}" stroke="${OUTLINE}" stroke-width="4"/>
  <circle cx="144" cy="96" r="9" fill="${BODY}" stroke="${OUTLINE}" stroke-width="4"/>
</svg>`;
}

export function loadSvgImage(svg: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("svg rasterization failed"));
    img.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
  });
}
