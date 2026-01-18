import { useEffect, useState } from "react";
import Layout from "../components/layout";
import {
  container,
  page,
  pageHeader,
  section,
  sectionHeader,
  sectionItem,
} from "../components/layout.module.css";
import {
  overlay,
  overlayHidden,
  box,
  confirmBoxBody,
  boxTitle,
  boxBody,
  accountPriority,
  accountPriorityActive,
  meterBG,
  meterFG,
  error,
} from "../components/account.module.css";

const NEXT_PUBLIC_API_ENDPOINT = process.env.NEXT_PUBLIC_API_ENDPOINT;

const isGuest = (id) => (id.indexOf("@") >= 0 ? false : true);
const isAdmin = (id) => (id.match(/^[a-zA-Z0-9_.+-]+@trace.moe$/) ? true : false);

const Account = () => {
  const [apiKey, setAPIKey] = useState("");
  const [apiKeyLabel, setAPIKeyLabel] = useState("");
  const [isResettingApiKey, setIsResettingApiKey] = useState(false);
  const [createUserLabel, setCreateUserLabel] = useState("");
  const [isCreatingUser, setIsCreatingUser] = useState(false);
  const [loading, setLoading] = useState(true);
  const [confirmed, setConfirmed] = useState();
  const [dialogue, setDialogue] = useState("");
  const [user, setUser] = useState({
    concurrency: 0,
    id: "",
    priority: 0,
    quota: 0,
    quotaUsed: 0,
  });
  const login = async (apiKey) => {
    setLoading(true);
    let res = await fetch(`${NEXT_PUBLIC_API_ENDPOINT}/me`, {
      headers: { "x-trace-key": apiKey || "" },
    });
    setAPIKey(res.status >= 400 ? "" : apiKey);
    const user = await res.json();
    setUser(user);
    setLoading(false);
    setAPIKeyLabel("");
    setCreateUserLabel("");
  };

  useEffect(() => {
    login();
  }, []);

  const submitLogin = async (e) => {
    e.preventDefault();
    e.target.querySelectorAll("input").forEach((e) => {
      e.disabled = true;
    });
    e.target.querySelector("#login-label").classList.remove(error);
    e.target.querySelector("#login-label").innerText = "";
    const email = e.target.querySelector("input[type=email]").value;
    const password = e.target.querySelector("input[type=password]").value;
    e.target.querySelector("#login-label").innerText = "Logging in...";
    const res = await fetch(`${NEXT_PUBLIC_API_ENDPOINT}/user/login`, {
      method: "POST",
      body: JSON.stringify({
        email,
        password,
      }),
      headers: { "Content-Type": "application/json" },
    });
    if (res.status >= 400) {
      e.target.querySelector("#login-label").innerText = (await res.json()).error;
      e.target.querySelector("#login-label").classList.add(error);
    } else {
      await login((await res.json()).key);
      e.target.querySelector("#login-label").innerText = "";
    }

    e.target.querySelectorAll("input").forEach((e) => {
      e.disabled = false;
    });
  };
  const logout = async (e) => {
    e.preventDefault();
    e.target.disabled = true;
    e.target.querySelector("#logout-label").innerText = "Logging out...";
    await login();
    e.target.querySelector("#logout-label").innerText = "";
    e.target.disabled = false;
  };

  const submitPassword = async (e) => {
    e.preventDefault();
    e.target.querySelectorAll("input").forEach((e) => {
      e.disabled = true;
    });
    e.target.querySelector("#password-label").classList.remove(error);
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
      e.target.querySelector("#password-label").classList.add(error);
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
          apiKeyClass = error;
        } else {
          const newApiKey = (await res.json()).key;
          setAPIKeyLabel("API Key has been reset.");
          setAPIKey(newApiKey);
        }
      }
      setConfirmed();
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
      <div className={`${overlay} ${!dialogue ? overlayHidden : ""}`}>
        <div className={box}>
          <div className={boxTitle}>Confirm</div>
          <div className={`${boxBody} ${confirmBoxBody}`}>
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
      <div className={`${container} ${page}`}>
        <div className={pageHeader}>Account</div>

        <div className={`${box} account-info loading`}>
          <div className={boxTitle}>Account Info</div>
          <div className={boxBody}>
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
                    Search Quota
                    <br />
                    (Monthly)
                  </td>
                  <td>
                    <div>{`${user.quotaUsed} / ${user.quota}`}</div>
                    {
                      <svg width="100%" height="8">
                        <rect x="0" y="0" width="100%" height="8" className={meterBG}></rect>
                        <rect
                          x="0"
                          y="0"
                          width={`${user.quota ? (user.quotaUsed / user.quota) * 100 : 0}%`}
                          height="8"
                          className={meterFG}
                        ></rect>
                      </svg>
                    }
                  </td>
                </tr>
                <tr>
                  <td>Priority</td>
                  <td className={accountPriority}>
                    <div className={user.priority === 0 ? accountPriorityActive : ""}>Low</div>
                    <div
                      className={
                        user.priority > 0 && user.priority <= 2 ? accountPriorityActive : ""
                      }
                    >
                      Medium
                    </div>
                    <div
                      className={
                        user.priority > 2 && user.priority <= 5 ? accountPriorityActive : ""
                      }
                    >
                      High
                    </div>
                    <div className={user.priority > 5 ? accountPriorityActive : ""}>Highest</div>
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
          <div className={`${box}`}>
            <div className={boxTitle}>Login</div>
            <div className={boxBody}>
              <form onSubmit={submitLogin}>
                <table>
                  <tbody>
                    <tr>
                      <td>
                        <label>User ID: </label>
                      </td>
                      <td>
                        <div>
                          <input type="email" size="1" placeholder="email address" required />
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
                            size="1"
                            placeholder="password"
                            minLength="8"
                            autoComplete="current-password"
                            required
                          />
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
                <div>
                  <div id="login-label"></div>
                  <input type="submit" value="Login" />
                </div>
              </form>
            </div>
          </div>
        )}

        {!isGuest(user.id) && (
          <div className={`${box} logout`}>
            <div className={boxTitle}>Logout</div>
            <div className={boxBody}>
              <form onSubmit={logout}>
                <div>
                  <div id="logout-label"></div>
                  <input type="submit" value="Logout" />
                </div>
              </form>
            </div>
          </div>
        )}

        {!loading && !isGuest(user.id) && (
          <div className={`${box} security`}>
            <div className={boxTitle}>Security</div>
            <div className={boxBody}>
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
                            size="1"
                            placeholder="New Password"
                            minLength="8"
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
          <div className={`${box} developer`}>
            <div className={boxTitle}>Developer's Zone</div>
            <div className={boxBody}>
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
                            size="1"
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
          <div className={`${box} create`}>
            <div className={boxTitle}>Create New User</div>
            <div className={boxBody}>
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
                            size="1"
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
                            min="0"
                            max="9"
                            size="1"
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
