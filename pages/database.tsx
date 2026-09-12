import { useEffect, useState } from "react";

import AnilistSearchInput from "../components/anilist-search-input";
import Layout from "../components/layout";

import chartStyles from "../components/chart.module.css";
import styles from "../components/layout.module.css";

const NEXT_PUBLIC_API_ENDPOINT = process.env.NEXT_PUBLIC_API_ENDPOINT;

interface AnilistCoverageInputProps {
  setMessage: (msg: string) => void;
  setRecords: (records: string[] | null) => void;
  setSearchedId: (id: string | number) => void;
}

const AnilistCoverageInput = ({
  setMessage,
  setRecords,
  setSearchedId,
}: AnilistCoverageInputProps) => {
  const [inputValue, setInputValue] = useState("");

  const checkCoverage = async (id: number | string) => {
    if (!id) return;
    setSearchedId(id);
    setMessage("Searching...");
    try {
      const status = await fetch(`${NEXT_PUBLIC_API_ENDPOINT}/status?id=${id}`).then((e) =>
        e.json(),
      );
      setMessage(`Found ${status.length} records`);
      if (status.length) {
        setRecords(status.map((e: any) => e.path.split("/").slice(1).join("/")));
      } else {
        setRecords([]);
      }
    } catch {
      setMessage("Error checking status");
      setRecords([]);
    }
  };

  return (
    <AnilistSearchInput
      className={styles.numberInput}
      placeholder="Anilist ID or title"
      value={inputValue}
      onChange={(val) => {
        setInputValue(val);
        if (/^\d+$/.test(val.trim())) {
          checkCoverage(val.trim());
        }
      }}
      onSelect={(suggestion) => {
        checkCoverage(suggestion.id);
      }}
    />
  );
};

const Database = () => {
  const [message, setMessage] = useState("");
  const [records, setRecords] = useState<string[] | null>(null);
  const [searchedId, setSearchedId] = useState<string | number>("");

  const [{ updated, rowCount, mediaCount, mediaFramesTotal, mediaDurationTotal }, setSystemStatus] =
    useState({
      updated: null,
      rowCount: 0,
      mediaCount: 0,
      mediaFramesTotal: 0,
      mediaDurationTotal: 0,
    });

  useEffect(() => {
    fetch(`${NEXT_PUBLIC_API_ENDPOINT}/status`)
      .then((e) => e.json())
      .then((e) => setSystemStatus(e));
  }, []);

  return (
    <Layout title="Database">
      <div className={`${styles.container} ${styles.page}`}>
        <div className={styles.pageHeader}>Database</div>

        <div className={styles.section}>
          <p>
            trace.moe automatically indexes the latest anime, usually within hours of broadcast.
          </p>

          <div className={chartStyles.statsGrid}>
            <div className={chartStyles.statItem}>
              <span className={chartStyles.statLabel}>Analyzed Video</span>
              <span className={chartStyles.statValue}>
                {mediaCount ? mediaCount.toLocaleString() : "counting..."}
              </span>
            </div>

            <div className={chartStyles.statItem}>
              <span className={chartStyles.statLabel}>Total Duration</span>
              <span className={chartStyles.statValue}>
                {mediaDurationTotal
                  ? `${Math.round(mediaDurationTotal / 3600).toLocaleString()}`
                  : "counting..."}
                <span className={chartStyles.statUnit}>hours</span>
              </span>
            </div>

            <div className={chartStyles.statItem}>
              <span className={chartStyles.statLabel}>Analyzed Frames</span>
              <span className={chartStyles.statValue}>
                {mediaFramesTotal ? mediaFramesTotal.toLocaleString() : "counting..."}
              </span>
            </div>

            <div className={chartStyles.statItem}>
              <span className={chartStyles.statLabel}>Indexed Frames</span>
              <span className={chartStyles.statValue}>
                {rowCount ? rowCount.toLocaleString() : "counting..."}
                {rowCount && mediaFramesTotal ? (
                  <span className={chartStyles.statUnit}>
                    ({((1 - rowCount / mediaFramesTotal) * 100).toFixed(1)}% de-duplicated)
                  </span>
                ) : null}
              </span>
            </div>
          </div>
        </div>

        <div className={styles.section} style={{ marginTop: "2rem" }}>
          <div className={styles.sectionHeader}>Check Database Entries</div>
          <p>
            Check whether a specific anime series, movie, or episode has been indexed by entering
            its AniList ID or searching by title:
          </p>
          <div style={{ margin: "1rem 0" }}>
            <AnilistCoverageInput
              setMessage={setMessage}
              setRecords={setRecords}
              setSearchedId={setSearchedId}
            />
            {message && <span style={{ marginLeft: "0.5rem" }}>{message}</span>}
          </div>
          <pre className={styles.fileList}>
            {records === null
              ? ""
              : records.length > 0
                ? records.join("\n")
                : `Cannot find any record for ID ${searchedId}`}
          </pre>
        </div>

        {updated && (
          <div className={chartStyles.footerStatus}>
            Last Database Update: {new Date(updated).toLocaleString()}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Database;
