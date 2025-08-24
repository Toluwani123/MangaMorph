// components/MangaPageViewer.jsx
import React, { useLayoutEffect, useRef, useState } from "react";

/**
 * Props now accept either pixel or percent coordinates.
 * If coordUnits === "percent", x/y/w/h are 0–100 percentages.
 * Otherwise treat them as natural-pixel coordinates.
 */
export default function MangaPageViewer({
  imageUrl,
  imageNaturalWidth,
  imageNaturalHeight,
  textBoxes,
  zoom = 100,
  mode = "edit",
  coordUnits = "pixel", // "pixel" | "percent"
}) {
  const imgRef = useRef(null);
  const [display, setDisplay] = useState({ w: 0, h: 0 });

  useLayoutEffect(() => {
    const update = () => {
      if (!imgRef.current) return;
      const r = imgRef.current.getBoundingClientRect();
      setDisplay({ w: r.width, h: r.height });
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const wrapperW = (imageNaturalWidth * zoom) / 100;
  const wrapperH = (imageNaturalHeight * zoom) / 100;

  // scale only used for pixel mode
  const scaleX = (display.w || 1) / imageNaturalWidth;
  const scaleY = (display.h || 1) / imageNaturalHeight;

  const toPx = (val, axis = "x") => {
    if (coordUnits === "percent") {
      // clamp just in case
      const pct = Math.max(0, Math.min(100, val));
      return (axis === "x" ? display.w : display.h) * (pct / 100);
    } else {
      // pixel → rendered px
      return (axis === "x" ? scaleX : scaleY) * val;
    }
  };

  return (
    <div
      className="relative mx-auto border rounded-lg shadow-sm bg-white"
      style={{ width: `${wrapperW}px`, height: `${wrapperH}px` }}
    >
      <img
        ref={imgRef}
        src={imageUrl}
        alt={imageUrl}
        className="w-full h-full object-contain select-none"
        draggable={false}
      />

      <div className={`absolute inset-0 ${mode === "edit" ? "pointer-events-none" : ""}`}>
        {textBoxes.map((tb) => {
          const left = toPx(tb.x, "x");
          const top = toPx(tb.y, "y");
          const width = toPx(tb.w, "x");
          const height = toPx(tb.h, "y");
          return (
            <div
              key={tb.id}
              className="absolute"
              style={{ left, top, width, height }}
            >
              <div
                className="w-full h-full flex items-center justify-center text-center bg-white/95 rounded-md shadow px-2 leading-tight"
                style={{
                  // heuristics: size with height a bit; tweak to taste
                  fontSize: Math.max(12, height * 0.22),
                  whiteSpace: "pre-wrap", // <<< handle "\n"
                }}
              >
                {tb.text}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
