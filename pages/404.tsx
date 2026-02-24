import Layout from "../components/layout";

import styles from "../components/layout.module.css";

const Custom404 = () => (
  <Layout title="Error 404 - Page Not Found">
    <div className={`${styles.container} ${styles.page}`}>
      <div className={styles.pageHeader}>Error 404 - Page Not Found</div>
    </div>
  </Layout>
);
export default Custom404;
