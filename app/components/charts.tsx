"use client";

import { useRef, useState } from "react";

interface ChartProps {
  data: { month: string; sales: number }[];
  title: string;
  type: "bar" | "line";
}

function getMax(data: { month: string; sales: number }[]) {
  return Math.max(...data.map((d) => d.sales), 1);
}

export default function Chart({ data, title, type }: ChartProps) {
  const svgWidth = 700;
  const svgHeight = 320;
  const margin = { top: 16, right: 16, bottom: 40, left: 48 };
  const innerWidth = svgWidth - margin.left - margin.right;
  const innerHeight = svgHeight - margin.top - margin.bottom;
  const max = getMax(data);
  const tooltipRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [tooltip, setTooltip] = useState<{ x: number; y: number; label: string } | null>(null);

  const points = data.map((d, i) => {
    const x = margin.left + (i + 0.5) * (innerWidth / data.length);
    const y = margin.top + innerHeight - (d.sales / max) * innerHeight;
    return { ...d, x, y };
  });

  function showTooltip(e: React.MouseEvent, label: string) {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    setTooltip({ x: e.clientX - rect.left + 8, y: e.clientY - rect.top + 8, label });
  }

  function hideTooltip() {
    setTooltip(null);
  }

  return (
    <div ref={containerRef} className="bg-white p-4 rounded-lg shadow-lg w-full h-80 relative">
      <h2 className="text-xl font-semibold mb-2">{title}</h2>
      <h2 className="text-xl font-semibold text-foreground mb-2">{title}</h2>

      <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-[85%]">
        {/* Gridlines */}
        {[0, 0.25, 0.5, 0.75, 1].map((t, i) => (
          <line
            key={i}
            x1={margin.left}
            x2={svgWidth - margin.right}
            y1={margin.top + innerHeight * (1 - t)}
            y2={margin.top + innerHeight * (1 - t)}
            stroke="var(--color-muted)"
            strokeWidth={1}
          />
        ))}

        {/* Y axis labels */}
        {[0, 0.25, 0.5, 0.75, 1].map((t, i) => (
          <text
            key={i}
            x={margin.left - 10}
            y={margin.top + innerHeight * (1 - t) + 4}
            fontSize={10}
            textAnchor="end"
            fill="var(--color-muted)"
          >
            {Math.round(max * t)}
          </text>
        ))}

        {/* X axis labels */}
        {points.map((p) => (
          <text
            key={p.month}
            x={p.x}
            y={svgHeight - 6}
            fontSize={10}
            textAnchor="middle"
            fill="var(--color-muted)"
          >
            {p.month}
          </text>
        ))}

        {/* Bars or Line */}
        {type === "bar" &&
          points.map((p) => {
            const barWidth = (innerWidth / data.length) * 0.6;
            const x = p.x - barWidth / 2;
            const height = margin.top + innerHeight - p.y;
            return (
              <rect
                key={p.month}
                x={x}
                y={p.y}
                width={barWidth}
                height={height}
                className="fill-indigo-400 dark:fill-indigo-500"
                rx={4}
                onMouseMove={(e) => showTooltip(e, `${p.month}: ${p.sales}`)}
                onMouseLeave={hideTooltip}
              />
            );
          })}

        {type === "line" && (
          <>
            <polyline
              fill="none"
              className="stroke-indigo-400 dark:stroke-indigo-500"
              strokeWidth={2}
              points={points.map((p) => `${p.x},${p.y}`).join(" ")}
            />
            {points.map((p) => (
              <circle
                key={p.month}
                cx={p.x}
                cy={p.y}
                r={3}
                className="fill-indigo-400 dark:fill-indigo-500"
                onMouseMove={(e) => showTooltip(e, `${p.month}: ${p.sales}`)}
                onMouseLeave={hideTooltip}
              />
            ))}
          </>
        )}

        {/* Axis line */}
        <line
          x1={margin.left}
          x2={svgWidth - margin.right}
          y1={svgHeight - margin.bottom}
          y2={svgHeight - margin.bottom}
          stroke="var(--color-foreground)"
          strokeWidth={1}
        />
      </svg>

      {tooltip && (
        <div
          ref={tooltipRef}
          className="chart-tooltip p-2 text-sm bg-foreground text-background rounded shadow-lg pointer-events-none absolute z-50"
          style={{ left: tooltip.x, top: tooltip.y }}
        >
          {tooltip.label}
        </div>
      )}
    </div>
  );
}
