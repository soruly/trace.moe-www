import Layout from "../components/layout";
import { container, page, pageHeader } from "../components/layout.module.css";

const Custom404 = () => (
  <Layout title="Error 404 - Page Not Found">
    <div className={`${container} ${page}`}>
      <div className={pageHeader}>Error 404 - Page Not Found</div>
    </div>
  </Layout>
);
export default Custom404;
