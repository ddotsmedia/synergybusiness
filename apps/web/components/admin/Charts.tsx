"use client";

import { useMemo } from "react";

/**
 * Tiny SVG sparkline. Avoids the ~150 KB recharts dependency for a feature
 * we currently use in exactly one place.
 */
export function Sparkline({
  values,
  width = 220,
  height = 56,
  stroke = "#c9a84c",
  fill = "rgba(201,168,76,0.15)",
}: {
  values: number[];
  width?: number;
  height?: number;
  stroke?: string;
  fill?: string;
}) {
  const { path, area, last, max } = useMemo(() => {
    if (values.length === 0) {
      return { path: "", area: "", last: 0, max: 0 };
    }
    const max = Math.max(1, ...values);
    const stepX = width / Math.max(1, values.length - 1);
    const points = values.map((v, i) => {
      const x = i * stepX;
      const y = height - (v / max) * (height - 4) - 2;
      return [x, y] as const;
    });
    const path =
      "M " +
      points
        .map(([x, y], i) => (i === 0 ? `${x},${y}` : `L ${x},${y}`))
        .join(" ");
    const area = `${path} L ${width},${height} L 0,${height} Z`;
    return { path, area, last: values[values.length - 1] ?? 0, max };
  }, [values, width, height]);

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-label={`Sparkline, peak ${max}, last ${last}`}
    >
      <path d={area} fill={fill} stroke="none" />
      <path
        d={path}
        fill="none"
        stroke={stroke}
        strokeWidth={1.75}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function HBar({
  label,
  value,
  max,
  total,
  color = "#0a2540",
}: {
  label: string;
  value: number;
  max: number;
  total: number;
  color?: string;
}) {
  const pct = max === 0 ? 0 : (value / max) * 100;
  const share = total === 0 ? 0 : Math.round((value / total) * 100);
  return (
    <div className="text-xs">
      <div className="flex items-center justify-between mb-1">
        <span className="text-[#1a2b3c] capitalize">{label}</span>
        <span className="text-[#6b7e96]">
          {value} <span className="text-[#94a8c0]">· {share}%</span>
        </span>
      </div>
      <div className="h-2 rounded-full bg-[#eef1f6] overflow-hidden">
        <div
          className="h-full rounded-full transition-[width] duration-500"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}
