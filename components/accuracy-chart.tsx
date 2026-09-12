import React, { useRef, useState } from "react";

import { PercentileItem } from "./speed-chart";

import styles from "./chart.module.css";

interface AccuracyChartProps {
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

const themeColor = "#10b981";

export default function AccuracyChart({
  data,
  period,
  onPeriodChange,
  title = "trace.moe accuracy distribution",
  loading = false,
}: AccuracyChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  const accuracyData = data || [];
  const yGridlines = [0, 0.25, 0.5, 0.75, 1.0];
  const labelInterval = Math.max(1, Math.floor(accuracyData.length / 6));

  const getAreaPath = (items: PercentileItem[], keyMin: string, keyMax: string) => {
    if (items.length === 0) return "";
    const divisor = Math.max(1, items.length - 1);
    const forward = items.map((item, i) => {
      const x = leftOffset + (i / divisor) * chartWidth;
      const y = topOffset + chartHeight - Number(item[keyMin] || 0) * chartHeight;
      return `${x},${y}`;
    });
    const backward = items
      .slice()
      .reverse()
      .map((item, i) => {
        const idx = items.length - 1 - i;
        const x = leftOffset + (idx / divisor) * chartWidth;
        const y = topOffset + chartHeight - Number(item[keyMax] || 0) * chartHeight;
        return `${x},${y}`;
      });
    return `M ${forward.join(" L ")} L ${backward.join(" L ")} Z`;
  };

  const getLinePath = (items: PercentileItem[], key: string) => {
    if (items.length === 0) return "";
    const divisor = Math.max(1, items.length - 1);
    return items
      .map((item, i) => {
        const x = leftOffset + (i / divisor) * chartWidth;
        const y = topOffset + chartHeight - Number(item[key] || 0) * chartHeight;
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
    hoveredIndex !== null && accuracyData[hoveredIndex] ? accuracyData[hoveredIndex] : null;

  return (
    <div className={styles.chartSection}>
      <div className={styles.sectionHeader}>
        <div className={styles.titleArea}>
          <h3 className={styles.sectionTitle}>{title}</h3>
          <div className={styles.chartLegend}>
            <div className={styles.legendItem}>
              <span
                className={styles.legendBand}
                style={{ backgroundColor: themeColor, opacity: 0.15 }}
              />
              <span>p10 - p90</span>
            </div>
            <div className={styles.legendItem}>
              <span
                className={styles.legendBand}
                style={{ backgroundColor: themeColor, opacity: 0.3 }}
              />
              <span>p25 - p75</span>
            </div>
            <div className={styles.legendItem}>
              <span className={styles.legendLine} style={{ backgroundColor: themeColor }} />
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

        {accuracyData.length > 0 ? (
          <svg viewBox="0 0 800 300" className={styles.chartSvg}>
            {/* Y Gridlines and Labels */}
            {yGridlines.map((gridVal) => {
              const y = topOffset + chartHeight - gridVal * chartHeight;
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
                    {Math.round(gridVal * 100)}%
                  </text>
                </g>
              );
            })}

            {/* X Ticks and Labels */}
            {accuracyData.map((item, i) => {
              if (i % labelInterval !== 0) return null;
              const x =
                leftOffset +
                (i / accuracyData.length) * chartWidth +
                (chartWidth / accuracyData.length) * 0.5;
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
              d={getAreaPath(accuracyData, "p10", "p90")}
              fill={themeColor}
              opacity="0.12"
              pointerEvents="none"
            />

            {/* Shaded Area p25-p75 */}
            <path
              d={getAreaPath(accuracyData, "p25", "p75")}
              fill={themeColor}
              opacity="0.25"
              pointerEvents="none"
            />

            {/* Outlines */}
            <path
              d={getLinePath(accuracyData, "p90")}
              fill="none"
              stroke={themeColor}
              strokeWidth="0.8"
              opacity="0.35"
              pointerEvents="none"
            />
            <path
              d={getLinePath(accuracyData, "p10")}
              fill="none"
              stroke={themeColor}
              strokeWidth="0.8"
              opacity="0.35"
              pointerEvents="none"
            />
            <path
              d={getLinePath(accuracyData, "p100")}
              fill="none"
              stroke={themeColor}
              strokeWidth="0.5"
              opacity="0.25"
              pointerEvents="none"
            />
            <path
              d={getLinePath(accuracyData, "p0")}
              fill="none"
              stroke={themeColor}
              strokeWidth="0.5"
              opacity="0.25"
              pointerEvents="none"
            />

            {/* Median p50 line */}
            <path
              d={getLinePath(accuracyData, "p50")}
              fill="none"
              stroke={themeColor}
              strokeWidth="2.5"
              pointerEvents="none"
            />

            {/* Hover Highlight Column */}
            {hoveredIndex !== null && (
              <rect
                x={
                  leftOffset +
                  (hoveredIndex / accuracyData.length) * chartWidth -
                  (chartWidth / accuracyData.length) * 0.125
                }
                y={topOffset}
                width={chartWidth / accuracyData.length}
                height={chartHeight}
                fill="currentColor"
                opacity="0.1"
                pointerEvents="none"
              />
            )}

            {/* Invisible Hover Rectangles */}
            {accuracyData.map((item, i) => {
              const stepWidth = chartWidth / accuracyData.length;
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
                <span className={styles.statusValue}>{(hoveredItem.p100 * 100).toFixed(1)}%</span>
              </div>
              <div className={styles.tooltipRow}>
                <span
                  className={styles.legendDot}
                  style={{ backgroundColor: themeColor, opacity: 0.4 }}
                />
                <span className={styles.statusName}>p90</span>
                <span className={styles.statusValue}>{(hoveredItem.p90 * 100).toFixed(1)}%</span>
              </div>
              <div className={styles.tooltipRow}>
                <span
                  className={styles.legendDot}
                  style={{ backgroundColor: themeColor, opacity: 0.7 }}
                />
                <span className={styles.statusName}>p75</span>
                <span className={styles.statusValue}>{(hoveredItem.p75 * 100).toFixed(1)}%</span>
              </div>
              <div className={styles.tooltipRow}>
                <span className={styles.legendDot} style={{ backgroundColor: themeColor }} />
                <span className={styles.statusName}>
                  <strong>Median (p50)</strong>
                </span>
                <span className={styles.statusValue}>
                  <strong>{(hoveredItem.p50 * 100).toFixed(1)}%</strong>
                </span>
              </div>
              <div className={styles.tooltipRow}>
                <span
                  className={styles.legendDot}
                  style={{ backgroundColor: themeColor, opacity: 0.7 }}
                />
                <span className={styles.statusName}>p25</span>
                <span className={styles.statusValue}>{(hoveredItem.p25 * 100).toFixed(1)}%</span>
              </div>
              <div className={styles.tooltipRow}>
                <span
                  className={styles.legendDot}
                  style={{ backgroundColor: themeColor, opacity: 0.4 }}
                />
                <span className={styles.statusName}>p10</span>
                <span className={styles.statusValue}>{(hoveredItem.p10 * 100).toFixed(1)}%</span>
              </div>
              <div className={styles.tooltipRow}>
                <span className={styles.statusName}>Min (p0)</span>
                <span className={styles.statusValue}>{(hoveredItem.p0 * 100).toFixed(1)}%</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
