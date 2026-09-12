import React, { useRef, useState } from "react";

import styles from "./chart.module.css";

export interface PercentileItem {
  time: string;
  p0: number;
  p10: number;
  p25: number;
  p50: number;
  p75: number;
  p90: number;
  p100: number;
  [key: string]: any;
}

interface SpeedChartProps {
  data: PercentileItem[] | null;
  period: "minute" | "hour" | "day";
  onPeriodChange: (period: "minute" | "hour" | "day") => void;
  title?: string;
  loading?: boolean;
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

export default function SpeedChart({
  data,
  period,
  onPeriodChange,
  title = "trace.moe search time distribution",
  loading = false,
}: SpeedChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  const speedData = data || [];

  const rawMax = Math.max(...speedData.map((d) => d.p100 || 0), 10);
  let maxSpeed = 10;
  if (rawMax <= 10) maxSpeed = 10;
  else if (rawMax <= 50) maxSpeed = 50;
  else if (rawMax <= 100) maxSpeed = 100;
  else if (rawMax <= 500) maxSpeed = 500;
  else if (rawMax <= 1000) maxSpeed = 1000;
  else if (rawMax <= 2000) maxSpeed = 2000;
  else if (rawMax <= 5000) maxSpeed = 5000;
  else if (rawMax <= 10000) maxSpeed = 10000;
  else {
    const magnitude = Math.pow(10, Math.floor(Math.log10(rawMax)));
    const ratio = rawMax / magnitude;
    const roundedRatio = Math.ceil(ratio * 2) / 2;
    maxSpeed = roundedRatio * magnitude;
  }

  const minSpeed = 10;
  const logMin = Math.log10(minSpeed);
  const logMax = Math.log10(maxSpeed);

  const speedToY = (val: number) => {
    const clamped = Math.max(minSpeed, val || 0);
    const logVal = Math.log10(clamped);
    const ratio = (logVal - logMin) / (logMax - logMin);
    return topOffset + chartHeight - ratio * chartHeight;
  };

  const candidateGridlines = [10, 20, 50, 100, 200, 500, 1000, 2000, 5000, 10000];
  const speedYGridlines = candidateGridlines.filter((val) => val >= minSpeed && val <= maxSpeed);
  const labelInterval = Math.max(1, Math.floor(speedData.length / 6));

  const getSpeedAreaPath = (items: PercentileItem[], keyMin: string, keyMax: string) => {
    if (items.length === 0) return "";
    const divisor = Math.max(1, items.length - 1);
    const forward = items.map((item, i) => {
      const x = leftOffset + (i / divisor) * chartWidth;
      const y = speedToY(item[keyMin]);
      return `${x},${y}`;
    });
    const backward = items
      .slice()
      .reverse()
      .map((item, i) => {
        const idx = items.length - 1 - i;
        const x = leftOffset + (idx / divisor) * chartWidth;
        const y = speedToY(item[keyMax]);
        return `${x},${y}`;
      });
    return `M ${forward.join(" L ")} L ${backward.join(" L ")} Z`;
  };

  const getSpeedLinePath = (items: PercentileItem[], key: string) => {
    if (items.length === 0) return "";
    const divisor = Math.max(1, items.length - 1);
    return items
      .map((item, i) => {
        const x = leftOffset + (i / divisor) * chartWidth;
        const y = speedToY(item[key]);
        return `${i === 0 ? "M" : "L"} ${x} ${y}`;
      })
      .join(" ");
  };

  const updateTooltipPosition = (event: React.MouseEvent) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      let x = event.clientX - rect.left + 15;
      let y = event.clientY - rect.top - 15;
      if (x > rect.width - 180) {
        x = event.clientX - rect.left - 190;
      }
      if (y < 10) y = 10;
      setTooltipPos({ x, y });
    }
  };

  const hoveredItem =
    hoveredIndex !== null && speedData[hoveredIndex] ? speedData[hoveredIndex] : null;
  const primaryColor = "var(--theme-strong-color, #4f46e5)";

  return (
    <div className={styles.chartSection}>
      <div className={styles.sectionHeader}>
        <div className={styles.titleArea}>
          <h3 className={styles.sectionTitle}>{title}</h3>
          <div className={styles.chartLegend}>
            <div className={styles.legendItem}>
              <span
                className={styles.legendBand}
                style={{ backgroundColor: primaryColor, opacity: 0.15 }}
              />
              <span>p10 - p90</span>
            </div>
            <div className={styles.legendItem}>
              <span
                className={styles.legendBand}
                style={{ backgroundColor: primaryColor, opacity: 0.3 }}
              />
              <span>p25 - p75</span>
            </div>
            <div className={styles.legendItem}>
              <span className={styles.legendLine} style={{ backgroundColor: primaryColor }} />
              <span>p50 (Median)</span>
            </div>
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

        {speedData.length > 0 ? (
          <svg viewBox="0 0 800 300" className={styles.chartSvg}>
            {/* Y Gridlines and Labels */}
            {speedYGridlines.map((gridVal) => {
              const y = speedToY(gridVal);
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
                    {gridVal.toLocaleString()} ms
                  </text>
                </g>
              );
            })}

            {/* X Ticks and Labels */}
            {speedData.map((item, i) => {
              if (i % labelInterval !== 0) return null;
              const x =
                leftOffset +
                (i / speedData.length) * chartWidth +
                (chartWidth / speedData.length) * 0.5;
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

            {/* Shaded Area p10-p90 */}
            <path
              d={getSpeedAreaPath(speedData, "p10", "p90")}
              fill={primaryColor}
              opacity="0.12"
              pointerEvents="none"
            />

            {/* Shaded Area p25-p75 */}
            <path
              d={getSpeedAreaPath(speedData, "p25", "p75")}
              fill={primaryColor}
              opacity="0.25"
              pointerEvents="none"
            />

            {/* Outlines */}
            <path
              d={getSpeedLinePath(speedData, "p90")}
              fill="none"
              stroke={primaryColor}
              strokeWidth="0.8"
              opacity="0.35"
              pointerEvents="none"
            />
            <path
              d={getSpeedLinePath(speedData, "p10")}
              fill="none"
              stroke={primaryColor}
              strokeWidth="0.8"
              opacity="0.35"
              pointerEvents="none"
            />
            <path
              d={getSpeedLinePath(speedData, "p100")}
              fill="none"
              stroke={primaryColor}
              strokeWidth="0.5"
              opacity="0.25"
              pointerEvents="none"
            />
            <path
              d={getSpeedLinePath(speedData, "p0")}
              fill="none"
              stroke={primaryColor}
              strokeWidth="0.5"
              opacity="0.25"
              pointerEvents="none"
            />

            {/* Median p50 line */}
            <path
              d={getSpeedLinePath(speedData, "p50")}
              fill="none"
              stroke={primaryColor}
              strokeWidth="2.5"
              pointerEvents="none"
            />

            {/* Hover Highlight Column */}
            {hoveredIndex !== null && (
              <rect
                x={
                  leftOffset +
                  (hoveredIndex / speedData.length) * chartWidth -
                  (chartWidth / speedData.length) * 0.125
                }
                y={topOffset}
                width={chartWidth / speedData.length}
                height={chartHeight}
                fill="currentColor"
                opacity="0.1"
                pointerEvents="none"
              />
            )}

            {/* Invisible Hover Rectangles */}
            {speedData.map((item, i) => {
              const stepWidth = chartWidth / speedData.length;
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

        {/* Tooltip */}
        {hoveredItem && (
          <div
            className={styles.chartTooltip}
            style={{ left: `${tooltipPos.x}px`, top: `${tooltipPos.y}px`, minWidth: "150px" }}
          >
            <div className={styles.tooltipTime}>{formatTooltipTime(hoveredItem.time, period)}</div>
            <div className={styles.tooltipDivider} />
            <div className={styles.tooltipBreakdown}>
              <div className={styles.tooltipRow}>
                <span className={styles.statusName}>Max (p100)</span>
                <span className={styles.statusValue}>{hoveredItem.p100} ms</span>
              </div>
              <div className={styles.tooltipRow}>
                <span
                  className={styles.legendDot}
                  style={{ backgroundColor: primaryColor, opacity: 0.4 }}
                />
                <span className={styles.statusName}>p90</span>
                <span className={styles.statusValue}>{hoveredItem.p90} ms</span>
              </div>
              <div className={styles.tooltipRow}>
                <span
                  className={styles.legendDot}
                  style={{ backgroundColor: primaryColor, opacity: 0.7 }}
                />
                <span className={styles.statusName}>p75</span>
                <span className={styles.statusValue}>{hoveredItem.p75} ms</span>
              </div>
              <div className={styles.tooltipRow}>
                <span className={styles.legendDot} style={{ backgroundColor: primaryColor }} />
                <span className={styles.statusName}>
                  <strong>Median (p50)</strong>
                </span>
                <span className={styles.statusValue}>
                  <strong>{hoveredItem.p50} ms</strong>
                </span>
              </div>
              <div className={styles.tooltipRow}>
                <span
                  className={styles.legendDot}
                  style={{ backgroundColor: primaryColor, opacity: 0.7 }}
                />
                <span className={styles.statusName}>p25</span>
                <span className={styles.statusValue}>{hoveredItem.p25} ms</span>
              </div>
              <div className={styles.tooltipRow}>
                <span
                  className={styles.legendDot}
                  style={{ backgroundColor: primaryColor, opacity: 0.4 }}
                />
                <span className={styles.statusName}>p10</span>
                <span className={styles.statusValue}>{hoveredItem.p10} ms</span>
              </div>
              <div className={styles.tooltipRow}>
                <span className={styles.statusName}>Min (p0)</span>
                <span className={styles.statusValue}>{hoveredItem.p0} ms</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
