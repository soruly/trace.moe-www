import { useEffect, useState } from "react";

import Layout from "../components/layout";
import SpeedChart, { PercentileItem } from "../components/speed-chart";
import TrafficChart, { TrafficItem } from "../components/traffic-chart";

import chartStyles from "../components/chart.module.css";
import styles from "../components/layout.module.css";

const NEXT_PUBLIC_API_ENDPOINT = process.env.NEXT_PUBLIC_API_ENDPOINT;

const Status = () => {
  const [{ memory, memoryUsage, storage, storageAvailable }, setSystemStatus] = useState({
    memory: 0,
    memoryUsage: 0,
    storage: 0,
    storageAvailable: 0,
  });

  useEffect(() => {
    fetch(`${NEXT_PUBLIC_API_ENDPOINT}/status`)
      .then((e) => e.json())
      .then((e) => setSystemStatus(e));
  }, []);

  const [trafficPeriod, setTrafficPeriod] = useState<"minute" | "hour" | "day">("hour");
  const [trafficData, setTrafficData] = useState<TrafficItem[] | null>(null);
  const [trafficLoading, setTrafficLoading] = useState(false);

  useEffect(() => {
    setTrafficLoading(true);
    fetch(`${NEXT_PUBLIC_API_ENDPOINT}/stats?type=traffic&period=${trafficPeriod}`)
      .then((e) => e.json())
      .then((stats) => {
        if (Array.isArray(stats)) {
          stats.sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime());
          setTrafficData(stats);
        }
      })
      .finally(() => setTrafficLoading(false));
  }, [trafficPeriod]);

  const [speedPeriod, setSpeedPeriod] = useState<"minute" | "hour" | "day">("hour");
  const [speedData, setSpeedData] = useState<PercentileItem[] | null>(null);
  const [speedLoading, setSpeedLoading] = useState(false);

  useEffect(() => {
    setSpeedLoading(true);
    fetch(`${NEXT_PUBLIC_API_ENDPOINT}/stats?type=speed&period=${speedPeriod}`)
      .then((e) => e.json())
      .then((stats) => {
        if (Array.isArray(stats)) {
          stats.sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime());
          setSpeedData(stats);
        }
      })
      .finally(() => setSpeedLoading(false));
  }, [speedPeriod]);

  return (
    <Layout title="System Status">
      <div className={`${styles.container} ${styles.page}`}>
        <div className={styles.pageHeader}>System Status</div>

        <div className={styles.section}>
          <p>
            This search engine indexes latest anime automatically, usually within hours after
            broadcast. You can also check real-time service availability on{" "}
            <a href="https://status.trace.moe" target="_blank" rel="noopener noreferrer">
              status.trace.moe
            </a>
            .
          </p>
          <div className={chartStyles.systemHealth}>
            <div className={chartStyles.statItem}>
              <div className={chartStyles.memoryHeader}>
                <span className={chartStyles.statLabel}>Memory Usage</span>
                <span className={chartStyles.statValueSub}>
                  {memory && memoryUsage
                    ? `${(memoryUsage / 1024 / 1024 / 1024).toFixed(2)} GB / ${(memory / 1024 / 1024 / 1024).toFixed(2)} GB`
                    : "calculating..."}
                </span>
              </div>
              <div className={chartStyles.progressBarBg}>
                <div
                  className={chartStyles.progressBarFill}
                  style={{
                    width: memory
                      ? `${Math.min(100, Math.max(0, (memoryUsage / memory) * 100)).toFixed(1)}%`
                      : "0%",
                  }}
                />
              </div>
            </div>

            <div className={chartStyles.statItem}>
              <div className={chartStyles.memoryHeader}>
                <span className={chartStyles.statLabel}>File System Usage</span>
                <span className={chartStyles.statValueSub}>
                  {storage && storageAvailable
                    ? `${((storage - storageAvailable) / 1024 / 1024 / 1024).toFixed(2)} GB / ${(storage / 1024 / 1024 / 1024).toFixed(2)} GB`
                    : "calculating..."}
                </span>
              </div>
              <div className={chartStyles.progressBarBg}>
                <div
                  className={chartStyles.progressBarFill}
                  style={{
                    width: storage
                      ? `${Math.min(100, Math.max(0, ((storage - storageAvailable) / storage) * 100)).toFixed(1)}%`
                      : "0%",
                  }}
                />
              </div>
            </div>
          </div>

          <TrafficChart
            data={trafficData}
            period={trafficPeriod}
            onPeriodChange={setTrafficPeriod}
            loading={trafficLoading}
          />

          <SpeedChart
            data={speedData}
            period={speedPeriod}
            onPeriodChange={setSpeedPeriod}
            loading={speedLoading}
          />
        </div>
      </div>
    </Layout>
  );
};

export default Status;
