import Link from "next/link";
import { useEffect, useState } from "react";

import { isAdmin, isGuest, useAuth } from "../components/auth";
import Layout from "../components/layout";

import accountStyles from "../components/account.module.css";
import styles from "../components/layout.module.css";

const NEXT_PUBLIC_API_ENDPOINT = process.env.NEXT_PUBLIC_API_ENDPOINT;

const Account = () => {
  const [apiKeyLabel, setAPIKeyLabel] = useState("");
  const [isResettingApiKey, setIsResettingApiKey] = useState(false);
  const [createUserLabel, setCreateUserLabel] = useState("");
  const [isCreatingUser, setIsCreatingUser] = useState(false);
  const [confirmed, setConfirmed] = useState(undefined);
  const [dialogue, setDialogue] = useState("");
  const { status, user: authUser, apiKey, setApiKey, refresh, logout } = useAuth();
  const loading = status === "loading";
  const user = authUser || {
    concurrency: 0,
    id: "",
    priority: 0,
    quota: 0,
    quotaUsed: 0,
  };

  useEffect(() => {
    if (!loading) refresh();
  }, [status]);

  const submitLogout = async (e) => {
    e.preventDefault();
    e.target.querySelector("#logout-label").innerText = "Logging out...";
    await logout();
  };

  const submitPassword = async (e) => {
    e.preventDefault();
    e.target.querySelectorAll("input").forEach((e) => {
      e.disabled = true;
    });
    e.target.querySelector("#password-label").classList.remove(accountStyles.error);
    e.target.querySelector("#password-label").innerText = "";
    const password = e.target.querySelector("input[type=password]").value;
    const res = await fetch(`${NEXT_PUBLIC_API_ENDPOINT}/user/reset-password`, {
      method: "POST",
      body: JSON.stringify({
        password,
      }),
      headers: {
        "Content-Type": "application/json",
        "x-trace-key": apiKey,
      },
    });
    if (res.status >= 400) {
      e.target.querySelector("#password-label").innerText = (await res.json()).error;
      e.target.querySelector("#password-label").classList.add(accountStyles.error);
    } else {
      e.target.querySelector("#password-label").innerText = "Password has changed successfully.";
    }
    e.target.querySelector("input[type=password]").value = "";
    e.target.querySelectorAll("input").forEach((e) => {
      e.disabled = false;
    });
  };

  let apiKeyClass = "";
  useEffect(() => {
    setDialogue("");
    (async () => {
      if (confirmed) {
        setAPIKeyLabel("Resetting API Key...");
        const res = await fetch(`${NEXT_PUBLIC_API_ENDPOINT}/user/reset-key`, {
          headers: { "x-trace-key": apiKey },
        });
        if (res.status >= 400) {
          setAPIKeyLabel((await res.json()).error);
          apiKeyClass = accountStyles.error;
        } else {
          const newApiKey = (await res.json()).key;
          setAPIKeyLabel("API Key has been reset.");
          setApiKey(newApiKey);
        }
      }
      setConfirmed(undefined);
      setIsResettingApiKey(false);
    })();
  }, [confirmed]);

  const resetAPIKey = async (e) => {
    e.preventDefault();
    setIsResettingApiKey(true);
    apiKeyClass = "";
    setAPIKeyLabel("");
    setDialogue("Are you sure you want to reset API Key?");
  };

  const createNewUser = async (e) => {
    e.preventDefault();
    setIsCreatingUser(true);
    setCreateUserLabel("");
    const res = await fetch(`${NEXT_PUBLIC_API_ENDPOINT}/user/create`, {
      method: "POST",
      body: JSON.stringify({
        email: e.target.querySelector("input[type=email]").value,
        tier: e.target.querySelector("input[type=number]").value,
      }),
      headers: {
        "Content-Type": "application/json",
        "x-trace-key": apiKey,
      },
    });
    if (res.status >= 400) {
      setCreateUserLabel((await res.json()).error);
    } else {
      setCreateUserLabel("User created and email is sent.");
    }
    e.target.querySelector("input[type=email]").value = "";
    setIsCreatingUser(false);
  };

  return (
    <Layout title="Account">
      <div className={`${accountStyles.overlay} ${!dialogue ? accountStyles.overlayHidden : ""}`}>
        <div className={accountStyles.box}>
          <div className={accountStyles.boxTitle}>Confirm</div>
          <div className={`${accountStyles.boxBody} ${accountStyles.confirmBoxBody}`}>
            <div>{dialogue}</div>
            <div>
              <button
                onClick={() => {
                  setConfirmed(false);
                }}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setConfirmed(true);
                }}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className={`${styles.container} ${styles.page}`}>
        <div className={styles.pageHeader}>Account</div>

        <div className={`${accountStyles.box} account-info loading`}>
          <div className={accountStyles.boxTitle}>Account Info</div>
          <div className={accountStyles.boxBody}>
            <table>
              <tbody>
                <tr>
                  <td>Account ID</td>
                  <td>{user.id}</td>
                </tr>
                <tr>
                  <td>Account Type</td>
                  <td>{`${isGuest(user.id) ? "Guest" : isAdmin(user.id) ? "Admin" : "User"}`}</td>
                </tr>
                <tr>
                  <td>
                    Daily Search Quota
                    <br />
                    (24-hour period)
                  </td>
                  <td>
                    <div>{`${user.quotaUsed} / ${user.quota}`}</div>
                    {
                      <svg width="100%" height="8">
                        <rect
                          x="0"
                          y="0"
                          width="100%"
                          height="8"
                          className={accountStyles.meterBG}
                        ></rect>
                        <rect
                          x="0"
                          y="0"
                          width={`${user.quota ? (user.quotaUsed / user.quota) * 100 : 0}%`}
                          height="8"
                          className={accountStyles.meterFG}
                        ></rect>
                      </svg>
                    }
                  </td>
                </tr>
                <tr>
                  <td>Priority</td>
                  <td className={accountStyles.accountPriority}>
                    <div className={user.priority === 0 ? accountStyles.accountPriorityActive : ""}>
                      Low
                    </div>
                    <div
                      className={
                        user.priority > 0 && user.priority <= 2
                          ? accountStyles.accountPriorityActive
                          : ""
                      }
                    >
                      Medium
                    </div>
                    <div
                      className={
                        user.priority > 2 && user.priority <= 5
                          ? accountStyles.accountPriorityActive
                          : ""
                      }
                    >
                      High
                    </div>
                    <div className={user.priority > 5 ? accountStyles.accountPriorityActive : ""}>
                      Highest
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>Concurrency Limit</td>
                  <td>{user.concurrency}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        {!loading && isGuest(user.id) && (
          <div className={`${accountStyles.box}`}>
            <div className={accountStyles.boxTitle}>Login</div>
            <div className={accountStyles.boxBody}>
              <div className={accountStyles.loginPrompt}>
                <div>(For Donators) Log in to view your account quota and API key.</div>
                <Link className={accountStyles.loginLink} href="/login?next=/account">
                  Login
                </Link>
              </div>
            </div>
          </div>
        )}

        {!isGuest(user.id) && (
          <div className={`${accountStyles.box} logout`}>
            <div className={accountStyles.boxTitle}>Logout</div>
            <div className={accountStyles.boxBody}>
              <form onSubmit={submitLogout}>
                <div>
                  <div id="logout-label"></div>
                  <input type="submit" value="Logout" />
                </div>
              </form>
            </div>
          </div>
        )}

        {!loading && !isGuest(user.id) && (
          <div className={`${accountStyles.box} security`}>
            <div className={accountStyles.boxTitle}>Security</div>
            <div className={accountStyles.boxBody}>
              <form onSubmit={submitPassword}>
                <table>
                  <tbody>
                    <tr>
                      <td>
                        <label>Change Password: </label>
                      </td>
                      <td>
                        <div>
                          <input
                            id="new-password"
                            type="password"
                            size={1}
                            placeholder="New Password"
                            minLength={8}
                            autoComplete="new-password"
                            required
                          />
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
                <div>
                  <div id="password-label"></div>
                  <input type="submit" value="Submit" />
                </div>
              </form>
            </div>
          </div>
        )}

        {!loading && !isGuest(user.id) && (
          <div className={`${accountStyles.box} developer`}>
            <div className={accountStyles.boxTitle}>Developer's Zone</div>
            <div className={accountStyles.boxBody}>
              <form onSubmit={resetAPIKey}>
                <table>
                  <tbody>
                    <tr>
                      <td>
                        <label>API Key: </label>
                      </td>
                      <td>
                        <div>
                          <input
                            id="api-key"
                            type="text"
                            size={1}
                            readOnly
                            value={apiKey}
                            disabled={isResettingApiKey}
                          />
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
                <div>
                  <div className={apiKeyClass}>{apiKeyLabel}</div>
                  <input type="submit" value="Reset" disabled={isResettingApiKey} />
                </div>
              </form>
            </div>
          </div>
        )}

        {!loading && isAdmin(user.id) && (
          <div className={`${accountStyles.box} create`}>
            <div className={accountStyles.boxTitle}>Create New User</div>
            <div className={accountStyles.boxBody}>
              <form onSubmit={createNewUser}>
                <table>
                  <tbody>
                    <tr>
                      <td>
                        <label>Email: </label>
                      </td>
                      <td>
                        <div>
                          <input
                            type="email"
                            size={1}
                            placeholder="email address"
                            required
                            disabled={isCreatingUser}
                          />
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <label>Tier: </label>
                      </td>
                      <td>
                        <div>
                          <input
                            type="number"
                            min={0}
                            max={9}
                            size={1}
                            defaultValue={1}
                            disabled={isCreatingUser}
                          />
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
                <div>
                  <div>{createUserLabel}</div>
                  <input type="submit" value="Submit" disabled={isCreatingUser} />
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};
export default Account;
