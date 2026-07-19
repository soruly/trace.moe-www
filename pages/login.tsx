import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import { useAuth } from "../components/auth";
import Layout from "../components/layout";

import accountStyles from "../components/account.module.css";
import styles from "../components/layout.module.css";

const getRedirectTarget = (next) =>
  typeof next === "string" && next.startsWith("/") && !next.startsWith("//") ? next : "/";

const Login = () => {
  const { status, login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [label, setLabel] = useState("");
  const [isError, setIsError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (status === "user" && router.isReady) {
      router.replace(getRedirectTarget(router.query.next));
    }
  }, [status, router.isReady]);

  const submitLogin = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setIsError(false);
    setLabel("Logging in...");
    const result = await login(email, password);
    if (result.ok) {
      setLabel("");
    } else {
      setLabel(result.error);
      setIsError(true);
      setIsSubmitting(false);
    }
  };

  return (
    <Layout title="Login">
      <div className={`${styles.container} ${styles.page}`}>
        <div className={styles.pageHeader}>Login</div>

        <div className={accountStyles.box}>
          <div className={accountStyles.boxTitle}>Login</div>
          <div className={accountStyles.boxBody}>
            <form onSubmit={submitLogin}>
              <table>
                <tbody>
                  <tr>
                    <td>
                      <label>User ID: </label>
                    </td>
                    <td>
                      <div>
                        <input
                          type="email"
                          name="email"
                          size={1}
                          placeholder="email address"
                          autoComplete="email"
                          required
                          value={email}
                          disabled={isSubmitting}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <label>Password: </label>
                    </td>
                    <td>
                      <div>
                        <input
                          type="password"
                          name="password"
                          size={1}
                          placeholder="password"
                          minLength={8}
                          autoComplete="current-password"
                          required
                          value={password}
                          disabled={isSubmitting}
                          onChange={(e) => setPassword(e.target.value)}
                        />
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
              <div>
                <div className={isError ? accountStyles.error : ""}>{label}</div>
                <input type="submit" value="Login" disabled={isSubmitting} />
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};
export default Login;
