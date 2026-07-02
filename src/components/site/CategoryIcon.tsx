import type * as React from "react";
// Realistic SVG icons for jewelry categories.
// Kept in a single file so every place (home grid, category page header,
// related-links chip) renders the exact same visual.

type Props = {
  slug: string;
  className?: string;
};

const stroke = "currentColor";

function Ring({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} fill="none" stroke={stroke} strokeWidth="1.5" aria-hidden="true">
      <circle cx="32" cy="40" r="16" />
      <circle cx="32" cy="40" r="12" opacity="0.4" />
      <path d="M22 24 L32 8 L42 24 Z" fill="currentColor" opacity="0.9" />
      <path d="M28 24 L32 14 L36 24 Z" fill="hsl(var(--background))" opacity="0.5" />
    </svg>
  );
}

function Necklace({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} fill="none" stroke={stroke} strokeWidth="1.5" aria-hidden="true">
      <path d="M10 14 C 18 42, 46 42, 54 14" />
      <path d="M12 15 C 20 40, 44 40, 52 15" opacity="0.4" />
      <path d="M32 42 L28 50 L32 56 L36 50 Z" fill="currentColor" />
      <circle cx="32" cy="42" r="1.5" fill="currentColor" />
    </svg>
  );
}

function Bracelet({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} fill="none" stroke={stroke} strokeWidth="1.5" aria-hidden="true">
      <ellipse cx="32" cy="34" rx="22" ry="10" />
      <ellipse cx="32" cy="30" rx="22" ry="10" fill="hsl(var(--background))" />
      <circle cx="32" cy="20" r="3.5" fill="currentColor" />
      <circle cx="20" cy="22" r="2" fill="currentColor" />
      <circle cx="44" cy="22" r="2" fill="currentColor" />
      <circle cx="12" cy="27" r="1.5" fill="currentColor" />
      <circle cx="52" cy="27" r="1.5" fill="currentColor" />
    </svg>
  );
}

function Bangle({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} fill="none" stroke={stroke} strokeWidth="1.5" aria-hidden="true">
      <ellipse cx="32" cy="32" rx="22" ry="20" />
      <ellipse cx="32" cy="32" rx="16" ry="14" fill="hsl(var(--background))" />
      <path d="M32 12 L32 18 M32 46 L32 52 M10 32 L16 32 M48 32 L54 32" strokeWidth="1" opacity="0.6" />
    </svg>
  );
}

function Earring({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} fill="none" stroke={stroke} strokeWidth="1.5" aria-hidden="true">
      <g transform="translate(-6 0)">
        <path d="M28 8 C 20 8, 20 22, 28 22" />
        <circle cx="28" cy="34" r="6" fill="currentColor" />
        <path d="M28 40 L24 52 L28 58 L32 52 Z" fill="currentColor" opacity="0.85" />
      </g>
      <g transform="translate(14 0)">
        <path d="M28 8 C 20 8, 20 22, 28 22" opacity="0.5" />
        <circle cx="28" cy="34" r="6" fill="currentColor" opacity="0.5" />
        <path d="M28 40 L24 52 L28 58 L32 52 Z" fill="currentColor" opacity="0.4" />
      </g>
    </svg>
  );
}

function Cuff({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} fill="none" stroke={stroke} strokeWidth="1.5" aria-hidden="true">
      <path d="M14 20 A 22 20 0 0 1 50 20" />
      <path d="M14 44 A 22 20 0 0 0 50 44" />
      <path d="M14 20 L14 44" />
      <path d="M50 20 L50 44" />
      <circle cx="14" cy="32" r="2.5" fill="currentColor" />
      <circle cx="50" cy="32" r="2.5" fill="currentColor" />
      <path d="M22 32 L42 32" strokeWidth="1" opacity="0.5" />
    </svg>
  );
}

function Gerdanlik({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} fill="none" stroke={stroke} strokeWidth="1.5" aria-hidden="true">
      <path d="M8 14 C 18 44, 46 44, 56 14" />
      <path d="M10 15 C 19 40, 45 40, 54 15" opacity="0.5" />
      <path d="M12 16 C 20 36, 44 36, 52 16" opacity="0.3" />
      <path d="M32 44 L26 54 L32 60 L38 54 Z" fill="currentColor" />
      <circle cx="24" cy="40" r="1.5" fill="currentColor" />
      <circle cx="40" cy="40" r="1.5" fill="currentColor" />
      <circle cx="32" cy="46" r="1" fill="hsl(var(--background))" />
    </svg>
  );
}

function Set({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} fill="none" stroke={stroke} strokeWidth="1.5" aria-hidden="true">
      {/* necklace */}
      <path d="M12 10 C 20 32, 44 32, 52 10" />
      <path d="M32 32 L29 38 L32 42 L35 38 Z" fill="currentColor" />
      {/* ring */}
      <circle cx="20" cy="52" r="7" />
      <path d="M16 46 L20 40 L24 46 Z" fill="currentColor" />
      {/* earring */}
      <circle cx="46" cy="48" r="4" fill="currentColor" />
      <path d="M46 42 C 42 42, 42 46, 46 46" />
      <path d="M46 52 L44 58 L46 60 L48 58 Z" fill="currentColor" opacity="0.8" />
    </svg>
  );
}

function Pendant({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} fill="none" stroke={stroke} strokeWidth="1.5" aria-hidden="true">
      <path d="M32 8 C 22 8, 22 22, 32 22" />
      <path d="M32 8 C 42 8, 42 22, 32 22" />
      <path d="M32 22 L20 38 L32 56 L44 38 Z" fill="currentColor" />
      <path d="M32 26 L26 38 L32 50 L38 38 Z" fill="hsl(var(--background))" opacity="0.4" />
      <circle cx="32" cy="38" r="2.5" fill="currentColor" />
    </svg>
  );
}

const map: Record<string, (p: { className?: string }) => React.ReactElement> = {
  yuzukler: Ring,
  kolyeler: Necklace,
  bilezikler: Bracelet,
  bileklikler: Bangle,
  kupeler: Earring,
  kelepceler: Cuff,
  gerdanliklar: Gerdanlik,
  setler: Set,
  "kolye-uclari": Pendant,
};

export function CategoryIcon({ slug, className }: Props) {
  const Icon = map[slug] ?? Ring;
  return <Icon className={className ?? "w-14 h-14 md:w-16 md:h-16"} />;
}
