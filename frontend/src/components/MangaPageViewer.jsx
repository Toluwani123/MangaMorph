// MangaPageViewer.jsx
import React from "react";
import BubblePin from "./BubblePin";

/**
 * Props
 * - imageUrl: string
 * - imageNaturalWidth, imageNaturalHeight: numbers (natural px)
 * - textBoxes: [{ id, x, y, w, h, text, rotation?, fontSize? }]   // x/y/w/h in % (0–100) or pixels
 * - zoom: 25..200 (%)
 * - mode: "view" | "edit"        // if "edit", overlay ignores pointer events
 * - coordUnits: "percent" | "pixel"
 * - displayMode: "pins" | "overlays"
 * - overlayOpacity: 0..1
 */
export default function MangaPageViewer({
  imageUrl,
  imageNaturalWidth,
  imageNaturalHeight,
  textBoxes,
  zoom = 100,
  mode = "view",
  coordUnits = "percent",
  displayMode = "pins",
  overlayOpacity = 0.55,
}) {
  // Wrapper (frame) size in CSS px – you control this via zoom
  const wrapperW = Math.round((imageNaturalWidth * zoom) / 100);
  const wrapperH = Math.round((imageNaturalHeight * zoom) / 100);

  // With object-contain the image is scaled uniformly to fit into wrapper
  const scale = Math.min(wrapperW / imageNaturalWidth, wrapperH / imageNaturalHeight);
  const renderedW = imageNaturalWidth * scale;
  const renderedH = imageNaturalHeight * scale;
  const offsetX = (wrapperW - renderedW) / 2; // left letterbox margin inside wrapper
  const offsetY = (wrapperH - renderedH) / 2; // top letterbox margin inside wrapper

  // Convert a coord to CSS px inside the rendered image area (NOT the full wrapper)
  const toPxX = (val) =>
    coordUnits === "percent" ? renderedW * (Math.max(0, Math.min(100, val)) / 100) : scale * val;
  const toPxY = (val) =>
    coordUnits === "percent" ? renderedH * (Math.max(0, Math.min(100, val)) / 100) : scale * val;

  return (
    <div
      className="relative mx-auto border rounded-lg shadow-sm bg-white"
      style={{ width: wrapperW, height: wrapperH }}
    >
      <img
        src={imageUrl}
        alt="Manga page"
        className="w-full h-full object-contain select-none"
        draggable={false}
      />

      {/* Overlay layer sits on top of the wrapper; we add offsets so positions align with the image */}
      <div
        className={`absolute inset-0 ${mode === "edit" ? "pointer-events-none" : ""}`}
        style={{ zIndex: 1 }}
      >
        {textBoxes.map((tb, idx) => {
          const left = offsetX + toPxX(tb.x);
          const top = offsetY + toPxY(tb.y);
          const width = toPxX(tb.w ?? tb.width);
          const height = toPxY(tb.h ?? tb.height);
          const ratio = height / Math.max(1, width);
          const isVertical = ratio > 1.6; // heuristic for vertical bubbles

          if (displayMode === "pins") {
            const cx = left + width / 2;
            const cy = top + height / 2;
            return (
              <BubblePin
                key={tb.id ?? idx}
                x={cx}
                y={cy}
                index={idx}
                label={tb.text}
                color="rgb(234,88,12)" // orange-600; tweak to brand
                onClick={() => {
                  // e.g., open editor for tb.id
                  // setSelectedId?.(tb.id)
                }}
              />
            );
          }

          // overlays mode (auto-fit font, translucent backer)
          const estFont = Math.round(
            Math.min(
              height * 0.38, // bound by height
              (width / Math.max(8, (tb.text || "").length)) * 1.8 // bound by width & length
            )
          );

          return (
            <div
              key={tb.id ?? idx}
              className="absolute"
              style={{
                left,
                top,
                width,
                height,
                transform: isVertical ? "rotate(90deg)" : "none",
                transformOrigin: "center",
              }}
            >
              <div
                className="w-full h-full flex items-center justify-center text-center rounded-md px-2"
                style={{
                  background: `rgba(255,255,255,${overlayOpacity})`,
                  backdropFilter: "blur(2px) brightness(1.05)",
                  border: "1px solid rgba(0,0,0,.06)",
                  lineHeight: 1.15,
                  whiteSpace: "pre-wrap", // keep \n
                  fontWeight: 600,
                  fontSize: Math.max(10, estFont),
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
