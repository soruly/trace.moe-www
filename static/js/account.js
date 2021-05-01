(async () => {
  const user = await fetch("https://api.trace.moe/me").then((e) => e.json());
  document.querySelector("#account-id").innerText = user.id;
  document.querySelector("#account-type").innerText = user.email ? "User" : "Guest";
  document.querySelector("#account-email").innerText = user.email || "N/A";
  document.querySelector("#account-quota").innerText = `${user.quotaUsed} / ${user.quota}`;
  document.querySelector("#account-rate-limit").innerText = `${user.rateLimit} per minute`;
  document.querySelector("#account-concurrency-limit").innerText = `${user.concurrency}`;
  document
    .querySelector(".meter-fg")
    .setAttribute("width", `${(user.quotaUsed / user.quota) * 100}%`);
  document.querySelector(".account-info").style.opacity = 1;
})();
