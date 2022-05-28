(async () => {
  if (!navigator.serviceWorker) return;
  if (navigator.userAgent.includes("Mac") && "ontouchend" in document) return; // iOS
  navigator.serviceWorker.register("/sw.js");
})();
