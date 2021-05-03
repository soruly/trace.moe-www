const renderPage = async (e) => {
  document.querySelector(".account-id").innerText = "";
  document.querySelector(".account-type").innerText = "";
  document.querySelector(".account-email").innerText = "";
  document.querySelector(".account-quota").innerText = "";
  document.querySelector(".account-rate-limit").innerText = "";
  document.querySelector(".account-concurrency-limit").innerText = "";
  document.querySelector("svg").style.display = "none";
  document.querySelector(".meter-fg").setAttribute("width", "0%");
  let apiKey = localStorage.getItem("apiKey");
  let res = await fetch(`https://api.trace.moe/me${apiKey ? `?key=${apiKey}` : ""}`);
  if (res.status >= 400) {
    localStorage.removeItem("apiKey");
    apiKey = null;
    res = await fetch("https://api.trace.moe/me");
  }
  const user = await res.json();

  if (user) {
    document.querySelector(".account-id").innerText = user.id;
    document.querySelector(".account-type").innerText = user.email ? "User" : "Guest";
    document.querySelector(".account-email").innerText = user.email || "N/A";
    document.querySelector(".account-quota").innerText = `${user.quotaUsed} / ${user.quota}`;
    document.querySelector(".account-rate-limit").innerText = `${user.rateLimit} per minute`;
    document.querySelector(".account-concurrency-limit").innerText = `${user.concurrency}`;
    document
      .querySelector(".meter-fg")
      .setAttribute("width", `${(user.quotaUsed / user.quota) * 100}%`);
    document.querySelector("svg").style.display = "inline";
  }

  if (apiKey) {
    document.querySelector(".box.login").classList.add("hidden");
    document.querySelector(".box.developer").classList.remove("hidden");
    document.querySelector(".box.security").classList.remove("hidden");
    document.querySelector(".box.logout").classList.remove("hidden");
    document.querySelector("#api-key").value = apiKey;
  } else {
    document.querySelector(".box.login").classList.remove("hidden");
    document.querySelector(".box.developer").classList.add("hidden");
    document.querySelector(".box.security").classList.add("hidden");
    document.querySelector(".box.logout").classList.add("hidden");
    document.querySelector("#api-key").value = "";
  }
  document.querySelector("#password-label").innerText = "";
  document.querySelector("#api-key-label").innerText = "";
};

(async () => {
  await renderPage();
})();

document.querySelector(".login form").onsubmit = async (e) => {
  e.preventDefault();
  document.querySelectorAll(".login form input").forEach((e) => {
    e.disabled = true;
  });
  document.querySelector("#login-label").classList.remove("error");
  document.querySelector("#login-label").innerText = "";
  const email = document.querySelector("#email").value;
  const password = document.querySelector("#password").value;
  document.querySelector("#login-label").innerText = "Logging in...";
  const res = await fetch("https://api.trace.moe/user/login", {
    method: "POST",
    body: JSON.stringify({
      email,
      password,
    }),
    headers: { "Content-Type": "application/json" },
  });
  if (res.status >= 400) {
    document.querySelector("#login-label").innerText = (await res.json()).error;
    document.querySelector("#login-label").classList.add("error");
  } else {
    localStorage.setItem("apiKey", (await res.json()).key);
    await renderPage();
    document.querySelector("#login-label").innerText = "";
  }

  document.querySelectorAll(".login form input").forEach((e) => {
    e.disabled = false;
  });
};

document.querySelector(".logout-btn").onclick = async (e) => {
  document.querySelector(".logout-btn").disabled = true;
  localStorage.removeItem("apiKey");
  await renderPage();
  document.querySelector(".logout-btn").disabled = false;
};

document.querySelector(".security form").onsubmit = async (e) => {
  e.preventDefault();
  document.querySelectorAll(".security form input").forEach((e) => {
    e.disabled = true;
  });
  document.querySelector("#password-label").classList.remove("error");
  document.querySelector("#password-label").innerText = "";
  const password = document.querySelector("#new-password").value;
  const res = await fetch("https://api.trace.moe/user/reset-password", {
    method: "POST",
    body: JSON.stringify({
      password,
    }),
    headers: { "Content-Type": "application/json", "x-trace-key": localStorage.getItem("apiKey") },
  });
  if (res.status >= 400) {
    document.querySelector("#password-label").innerText = (await res.json()).error;
    document.querySelector("#password-label").classList.add("error");
  } else {
    document.querySelector("#password-label").innerText = "Password has changed successfully.";
  }
  document.querySelector("#new-password").value = "";
  document.querySelectorAll(".security form input").forEach((e) => {
    e.disabled = false;
  });
};

document.querySelector(".developer form").onsubmit = async (e) => {
  e.preventDefault();
  document.querySelectorAll(".developer form input").forEach((e) => {
    e.disabled = true;
  });
  document.querySelector("#api-key-label").classList.remove("error");
  document.querySelector("#api-key-label").innerText = "";

  const confirm = await confirmDialogue("Are you sure you want to reset API Key?");
  if (confirm) {
    const res = await fetch("https://api.trace.moe/user/reset-key", {
      headers: { "x-trace-key": localStorage.getItem("apiKey") },
    });
    if (res.status >= 400) {
      document.querySelector("#api-key-label").innerText = (await res.json()).error;
      document.querySelector("#api-key-label").classList.add("error");
    } else {
      const newApiKey = (await res.json()).key;
      localStorage.setItem("apiKey", newApiKey);
      document.querySelector("#api-key").value = newApiKey;
      document.querySelector("#api-key-label").innerText = "API Key has been reset.";
    }
  }
  document.querySelectorAll(".developer form input").forEach((e) => {
    e.disabled = false;
  });
};

const confirmDialogue = (text) =>
  new Promise((resolve) => {
    document.querySelector(".dialogue .body > div").innerText = text;
    document.querySelector(".cancel-btn").onclick = (e) => {
      document.querySelector(".overlay").classList.add("hidden");
      resolve(false);
    };
    document.querySelector(".confirm-btn").onclick = (e) => {
      document.querySelector(".overlay").classList.add("hidden");
      resolve(true);
    };
    document.querySelector(".overlay").classList.remove("hidden");
  });
