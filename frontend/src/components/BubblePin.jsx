// components/BubblePin.jsx
import React from "react";

export default function BubblePin({
  x, y, onClick, label, index, color = "rgb(99,102,241)" /* indigo-500 */
}) {
  // center the 44x44 tap-target on (x,y)
  const HIT = 44;                 // big, accessible target
  const DOT = 14;                 // visible inner dot
  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={label}
      onClick={onClick}
      onKeyDown={(e)=> (e.key==='Enter'||e.key===' ') && onClick?.(e)}
      className="group absolute cursor-pointer select-none"
      style={{ left: x - HIT/2, top: y - HIT/2, width: HIT, height: HIT }}
    >
      {/* pulsing halo */}
      <div
        className="absolute inset-0 rounded-full animate-ping"
        style={{ background: `${color}33`, /* 0x33 = ~20% */ }}
      />
      {/* solid disc with white ring + shadow (works on light/dark art) */}
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full ring-2 ring-white shadow-md"
        style={{ width: DOT, height: DOT, background: color, boxShadow: "0 1px 4px rgba(0,0,0,.35)" }}
      />
      {/* optional tiny index badge for quick scanning */}
      {typeof index === "number" && (
        <div className="absolute -top-2 -right-2 text-[10px] leading-none font-semibold px-1.5 py-0.5 rounded-full text-white"
             style={{ background: color }}>
          {index+1}
        </div>
      )}
      {/* hover tooltip (lightweight) */}
      <div
        className="pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 whitespace-pre-wrap
                   px-2 py-1 text-xs rounded-md opacity-0 group-hover:opacity-100 transition
                   bg-black/85 text-white shadow"
        style={{ maxWidth: 240 }}
      >
        {label}
      </div>
    </div>
  );
}
