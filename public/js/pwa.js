(async () => {
  if (!navigator.serviceWorker) return;
  navigator.serviceWorker.register("/sw.js");

  if (!("launchQueue" in window)) return;
  if (!("files" in LaunchParams.prototype)) return;

  window.launchQueue.setConsumer(async (launchParams) => {
    if (!launchParams.files.length) return;
    const canvas = document.createElement("canvas");
    const fileContents = await launchParams.files[0].getFile();
    const imageBitmap = await createImageBitmap(fileContents);
    canvas.width = imageBitmap.width;
    canvas.height = imageBitmap.height;
    canvas.getContext("2d").drawImage(imageBitmap, 0, 0, imageBitmap.width, imageBitmap.height);
    document.querySelector("#originalImage").src = canvas.toDataURL("image/jpeg", 0.9);
  });
})();
