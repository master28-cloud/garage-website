import type { SVGProps } from "react";

// Simplified versions of the ISO 2575 dashboard symbols, drawn on the same
// 24px grid and stroke weight as the lucide icons used elsewhere on the site.

type P = SVGProps<SVGSVGElement>;

const base = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true
} as const;

// The pair of brackets either side of the brake and ABS symbols.
const brackets = "M4.5 6.5a8.5 8.5 0 0 0 0 11M19.5 6.5a8.5 8.5 0 0 1 0 11";

export function CheckEngine(p: P) {
  return (
    <svg {...base} {...p}>
      <path d="M9 5h5M11.5 5v2" />
      <path d="M6 9h3V7h6l1.5 2H18v2h1.5V9H21v8h-1.5v-2H18v1.5L15.5 19H9l-3-3z" />
      <path d="M3 10v6M3 13h3" />
    </svg>
  );
}

export function OilPressure(p: P) {
  return (
    <svg {...base} {...p}>
      <path d="M9 9h4M11 9v2" />
      <path d="M3 11.5h4.5l1-.5h6l1.5 1.5 6-2.5-5.5 6.5H8.5l-1-2.5H3z" />
      <path d="M21.5 13.5c.5.7.8 1.2.8 1.6a.8.8 0 0 1-1.6 0c0-.4.3-.9.8-1.6z" fill="currentColor" />
    </svg>
  );
}

export function Battery(p: P) {
  return (
    <svg {...base} {...p}>
      <rect x="3" y="7.5" width="18" height="12" rx="1.5" />
      <path d="M6.5 7.5v-2h3v2M14.5 7.5v-2h3v2" />
      <path d="M6.5 13.5h3M14.5 13.5h3M16 12v3" />
    </svg>
  );
}

export function CoolantTemp(p: P) {
  return (
    <svg {...base} {...p}>
      <path d="M10.75 11V3.75a1.25 1.25 0 0 1 2.5 0V11a2.6 2.6 0 1 1-2.5 0z" />
      <path d="M13.25 5.5h2M13.25 8h2" />
      <path d="M2.5 18.5c1.6 0 1.6-1 3.2-1s1.6 1 3.2 1 1.6-1 3.2-1 1.6 1 3.2 1 1.6-1 3.2-1 1.6 1 3.2 1" />
      <path d="M2.5 21.5c1.6 0 1.6-1 3.2-1s1.6 1 3.2 1 1.6-1 3.2-1 1.6 1 3.2 1 1.6-1 3.2-1 1.6 1 3.2 1" />
    </svg>
  );
}

export function Brake(p: P) {
  return (
    <svg {...base} {...p}>
      <circle cx="12" cy="12" r="6" />
      <path d="M12 9v3.75M12 15.2v.05" />
      <path d={brackets} />
    </svg>
  );
}

export function Abs(p: P) {
  return (
    <svg {...base} {...p}>
      <circle cx="12" cy="12" r="6" />
      <text
        x="12"
        y="13.65"
        textAnchor="middle"
        fontSize="4.6"
        fontWeight="700"
        fontFamily="Arial, Helvetica, sans-serif"
        fill="currentColor"
        stroke="none"
      >
        ABS
      </text>
      <path d={brackets} />
    </svg>
  );
}

export function TyrePressure(p: P) {
  return (
    <svg {...base} {...p}>
      <path d="M7 4.5C4.4 7.9 4 14.1 6.2 18h11.6c2.2-3.9 1.8-10.1-.8-13.5" />
      <path d="M7.5 18v2M10.5 18v2M13.5 18v2M16.5 18v2" />
      <path d="M12 8v5M12 15.6v.05" />
    </svg>
  );
}

export function Airbag(p: P) {
  return (
    <svg {...base} {...p}>
      <circle cx="7.5" cy="4.5" r="1.75" />
      <path d="M7.5 8.25l1.25 5.75h4.5l1.25 6" />
      <path d="M5 8.5l1.5 8.5H11" />
      <circle cx="16.25" cy="8.5" r="3.5" />
    </svg>
  );
}

export function PowerSteering(p: P) {
  return (
    <svg {...base} {...p}>
      <circle cx="10.5" cy="12" r="7" />
      <circle cx="10.5" cy="12" r="2" />
      <path d="M3.5 12h5M12.5 12h5M10.5 14v5" />
      <path d="M21 8v5M21 16v.05" />
    </svg>
  );
}

export function Traction(p: P) {
  return (
    <svg {...base} {...p}>
      <path d="M6 11.5l1.4-4.1A1.5 1.5 0 0 1 8.8 6.4h6.4a1.5 1.5 0 0 1 1.4 1l1.4 4.1" />
      <rect x="4.5" y="11.5" width="15" height="4" rx="1" />
      <path d="M6.5 15.5V17M17.5 15.5V17" />
      <path d="M8.5 22.5c-1.2-1.1 1.2-2.4 0-3.5M15.5 22.5c-1.2-1.1 1.2-2.4 0-3.5" />
    </svg>
  );
}
