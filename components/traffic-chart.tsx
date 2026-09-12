import React, { useRef, useState } from "react";

import styles from "./chart.module.css";

export interface TrafficItem {
  time: string;
  total?: number;
  [key: string]: any;
}

interface TrafficChartProps {
  data: TrafficItem[] | null;
  period: "minute" | "hour" | "day";
  onPeriodChange: (period: "minute" | "hour" | "day") => void;
  title?: string;
  loading?: boolean;
}

const statusColors: Record<string, string> = {
  "200": "#66cc66",
  "400": "#ffcc33",
  "402": "#ccccff",
  "405": "#ff9933",
  "500": "#ff6666",
  "503": "#ff6666",
};

function getColor(code: string): string {
  return statusColors[code] || "#cbd5e1";
}

const topOffset = 20;
const rightOffset = 20;
const bottomOffset = 40;
const leftOffset = 60;
const chartWidth = 800 - leftOffset - rightOffset;
const chartHeight = 300 - topOffset - bottomOffset;

function formatTimeLabel(timeStr: string, period: "minute" | "hour" | "day") {
  if (!timeStr) return "";
  const date = new Date(timeStr);
  const hour = date.getHours().toString().padStart(2, "0");
  const minute = date.getMinutes().toString().padStart(2, "0");
  const month = date.getMonth() + 1;
  const day = date.getDate();

  if (period === "day") return `${day}/${month}`;
  if (period === "hour") return `${hour}:00`;
  return `${hour}:${minute}`;
}

function formatTooltipTime(timeStr: string, period: "minute" | "hour" | "day") {
  if (!timeStr) return "";
  const date = new Date(timeStr);
  if (period === "minute") {
    return date.toLocaleTimeString(undefined, {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
  }
  if (period === "hour") {
    return date.toLocaleString(undefined, {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  }
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function TrafficChart({
  data,
  period,
  onPeriodChange,
  title = "trace.moe search traffic",
  loading = false,
}: TrafficChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  const trafficData = data || [];

  // Determine active status codes
  const activeStatusCodes: string[] = [];
  for (const item of trafficData) {
    for (const key of Object.keys(item)) {
      if (
        key !== "time" &&
        key !== "total" &&
        !isNaN(Number(key)) &&
        !activeStatusCodes.includes(key)
      ) {
        activeStatusCodes.push(key);
      }
    }
  }
  activeStatusCodes.sort((a, b) => Number(a) - Number(b));
  if (activeStatusCodes.length === 0) {
    activeStatusCodes.push("200", "400", "402", "405", "500", "503");
  }

  // Calculate max total and rounded scale
  const rawMax = Math.max(
    ...trafficData.map((d) => {
      if (typeof d.total === "number") return d.total;
      return activeStatusCodes.reduce((sum, code) => sum + Number(d[code] || 0), 0);
    }),
    10,
  );

  let maxTotal = 10;
  if (rawMax <= 10) maxTotal = 10;
  else if (rawMax <= 50) maxTotal = 50;
  else if (rawMax <= 100) maxTotal = 100;
  else if (rawMax <= 500) maxTotal = 500;
  else if (rawMax <= 1000) maxTotal = 1000;
  else if (rawMax <= 2000) maxTotal = 2000;
  else if (rawMax <= 5000) maxTotal = 5000;
  else if (rawMax <= 10000) maxTotal = 10000;
  else {
    const magnitude = Math.pow(10, Math.floor(Math.log10(rawMax)));
    const ratio = rawMax / magnitude;
    const roundedRatio = Math.ceil(ratio * 2) / 2;
    maxTotal = roundedRatio * magnitude;
  }

  const yGridlines = [0, maxTotal * 0.25, maxTotal * 0.5, maxTotal * 0.75, maxTotal];
  const labelInterval = Math.max(1, Math.floor(trafficData.length / 6));

  const updateTooltipPosition = (event: React.MouseEvent) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      let x = event.clientX - rect.left + 15;
      let y = event.clientY - rect.top - 15;
      if (x > rect.width - 170) {
        x = event.clientX - rect.left - 180;
      }
      if (y < 10) y = 10;
      setTooltipPos({ x, y });
    }
  };

  const getSegments = (item: TrafficItem) => {
    let currentY = 0;
    const segments = [];
    for (const code of activeStatusCodes) {
      const val = Number(item[code] || 0);
      if (val > 0) {
        const segmentHeight = (val / maxTotal) * chartHeight;
        const y = topOffset + chartHeight - currentY - segmentHeight;
        segments.push({
          code,
          y,
          height: segmentHeight,
          value: val,
        });
        currentY += segmentHeight;
      }
    }
    return segments;
  };

  const hoveredItem =
    hoveredIndex !== null && trafficData[hoveredIndex] ? trafficData[hoveredIndex] : null;
  const hoveredTotal = hoveredItem
    ? typeof hoveredItem.total === "number"
      ? hoveredItem.total
      : activeStatusCodes.reduce((sum, code) => sum + Number(hoveredItem[code] || 0), 0)
    : 0;

  return (
    <div className={styles.chartSection}>
      <div className={styles.sectionHeader}>
        <div className={styles.titleArea}>
          <h3 className={styles.sectionTitle}>{title}</h3>
          <div className={styles.chartLegend}>
            {activeStatusCodes.map((code) => (
              <div key={code} className={styles.legendItem}>
                <span className={styles.legendDot} style={{ backgroundColor: getColor(code) }} />
                <span>{code}</span>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.periodSwitcher}>
          <button
            type="button"
            className={`${styles.periodBtn} ${period === "minute" ? styles.active : ""}`}
            onClick={() => onPeriodChange("minute")}
            disabled={loading}
          >
            60 mins
          </button>
          <button
            type="button"
            className={`${styles.periodBtn} ${period === "hour" ? styles.active : ""}`}
            onClick={() => onPeriodChange("hour")}
            disabled={loading}
          >
            72 hours
          </button>
          <button
            type="button"
            className={`${styles.periodBtn} ${period === "day" ? styles.active : ""}`}
            onClick={() => onPeriodChange("day")}
            disabled={loading}
          >
            60 days
          </button>
        </div>
      </div>

      <div ref={containerRef} className={styles.chartContainer}>
        {loading && (
          <div className={styles.loadingOverlay}>
            <div className={styles.spinner} />
          </div>
        )}

        {trafficData.length > 0 ? (
          <svg viewBox="0 0 800 300" className={styles.chartSvg}>
            {/* Y Gridlines and Labels */}
            {yGridlines.map((gridVal) => {
              const y = topOffset + chartHeight - (gridVal / maxTotal) * chartHeight;
              return (
                <g key={gridVal}>
                  <line
                    x1={leftOffset}
                    y1={y}
                    x2={leftOffset + chartWidth}
                    y2={y}
                    stroke="currentColor"
                    strokeDasharray="4 4"
                    opacity="0.3"
                  />
                  <text
                    x={leftOffset - 8}
                    y={y}
                    textAnchor="end"
                    dominantBaseline="middle"
                    fontSize="10"
                    fill="currentColor"
                    opacity="0.75"
                  >
                    {gridVal.toLocaleString()}
                  </text>
                </g>
              );
            })}

            {/* X Ticks and Labels */}
            {trafficData.map((item, i) => {
              if (i % labelInterval !== 0) return null;
              const x =
                leftOffset +
                (i / trafficData.length) * chartWidth +
                (chartWidth / trafficData.length) * 0.5;
              return (
                <g key={item.time || i}>
                  <line
                    x1={x}
                    y1={topOffset + chartHeight}
                    x2={x}
                    y2={topOffset + chartHeight + 4}
                    stroke="currentColor"
                    opacity="0.4"
                  />
                  <text
                    x={x}
                    y={topOffset + chartHeight + 16}
                    textAnchor="middle"
                    fontSize="10"
                    fill="currentColor"
                    opacity="0.75"
                  >
                    {formatTimeLabel(item.time, period)}
                  </text>
                </g>
              );
            })}

            {/* Stacked Bars */}
            {trafficData.map((item, i) => {
              const x = leftOffset + (i / trafficData.length) * chartWidth;
              const barWidth = (chartWidth / trafficData.length) * 0.75;
              return (
                <g key={item.time || i}>
                  {getSegments(item).map((segment) => (
                    <rect
                      key={segment.code}
                      x={x}
                      y={segment.y}
                      width={barWidth}
                      height={segment.height}
                      fill={getColor(segment.code)}
                      rx="1"
                    />
                  ))}
                </g>
              );
            })}

            {/* Hover Highlight Column */}
            {hoveredIndex !== null && (
              <rect
                x={
                  leftOffset +
                  (hoveredIndex / trafficData.length) * chartWidth -
                  (chartWidth / trafficData.length) * 0.125
                }
                y={topOffset}
                width={chartWidth / trafficData.length}
                height={chartHeight}
                fill="currentColor"
                opacity="0.1"
                pointerEvents="none"
              />
            )}

            {/* Invisible Hover Rectangles */}
            {trafficData.map((item, i) => {
              const stepWidth = chartWidth / trafficData.length;
              const x = leftOffset + i * stepWidth;
              return (
                <rect
                  key={item.time || i}
                  x={x - stepWidth * 0.125}
                  y={topOffset}
                  width={stepWidth}
                  height={chartHeight}
                  fill="transparent"
                  onMouseEnter={(e) => {
                    setHoveredIndex(i);
                    updateTooltipPosition(e);
                  }}
                  onMouseMove={updateTooltipPosition}
                  onMouseLeave={() => setHoveredIndex(null)}
                />
              );
            })}
          </svg>
        ) : (
          <div style={{ height: "300px" }} />
        )}

        {/* Hover Tooltip */}
        {hoveredItem && (
          <div
            className={styles.chartTooltip}
            style={{ left: `${tooltipPos.x}px`, top: `${tooltipPos.y}px` }}
          >
            <div className={styles.tooltipTime}>{formatTooltipTime(hoveredItem.time, period)}</div>
            <div className={styles.tooltipTotal}>Total: {hoveredTotal.toLocaleString()}</div>
            <div className={styles.tooltipDivider} />
            <div className={styles.tooltipBreakdown}>
              {activeStatusCodes.map((code) => {
                const val = Number(hoveredItem[code] || 0);
                if (val <= 0) return null;
                return (
                  <div key={code} className={styles.tooltipRow}>
                    <span
                      className={styles.legendDot}
                      style={{ backgroundColor: getColor(code) }}
                    />
                    <span className={styles.statusName}>{code}</span>
                    <span className={styles.statusValue}>{val.toLocaleString()}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
