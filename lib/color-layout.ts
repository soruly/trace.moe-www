import { ColorLayout } from "trace.moe-id";

// Pre-calculated transformation matrix for 8x8 Type-II IDCT
// prettier-ignore
const COSINE_ARRAY = [
  [3.535534e-1, 3.535534e-1, 3.535534e-1, 3.535534e-1, 3.535534e-1, 3.535534e-1, 3.535534e-1, 3.535534e-1],
  [4.903926e-1, 4.157348e-1, 2.777851e-1, 9.754516e-2, -9.754516e-2, -2.777851e-1, -4.157348e-1, -4.903926e-1],
  [4.619398e-1, 1.913417e-1, -1.913417e-1, -4.619398e-1, -4.619398e-1, -1.913417e-1, 1.913417e-1, 4.619398e-1],
  [4.157348e-1, -9.754516e-2, -4.903926e-1, -2.777851e-1, 2.777851e-1, 4.903926e-1, 9.754516e-2, -4.157348e-1],
  [3.535534e-1, -3.535534e-1, -3.535534e-1, 3.535534e-1, 3.535534e-1, -3.535534e-1, -3.535534e-1, 3.535534e-1],
  [2.777851e-1, -4.903926e-1, 9.754516e-2, 4.157348e-1, -4.157348e-1, -9.754516e-2, 4.903926e-1, -2.777851e-1],
  [1.913417e-1, -4.619398e-1, 4.619398e-1, -1.913417e-1, -1.913417e-1, 4.619398e-1, -4.619398e-1, 1.913417e-1],
  [9.754516e-2, -2.777851e-1, 4.157348e-1, -4.903926e-1, 4.903926e-1, -4.157348e-1, 2.777851e-1, -9.754516e-2],
];

const ZIG_ZAG_ARRAY = new Uint8Array([
  0, 1, 8, 16, 9, 2, 3, 10, 17, 24, 32, 25, 18, 11, 4, 5, 12, 19, 26, 33, 40, 48, 41, 34, 27, 20,
  13, 6, 7, 14, 21, 28, 35, 42, 49, 56, 57, 50, 43, 36, 29, 22, 15, 23, 30, 37, 44, 51, 58, 59, 52,
  45, 38, 31, 39, 46, 53, 60, 61, 54, 47, 55, 62, 63,
]);

const dct_buffer = new Float32Array(64);

const Idct = (coeffs: Float32Array, shapes: Float32Array) => {
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      let s = 0;
      for (let k = 0; k < 8; k++) {
        s += COSINE_ARRAY[k][i] * coeffs[8 * k + j];
      }
      dct_buffer[8 * i + j] = s;
    }
  }
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      let s = 0;
      for (let k = 0; k < 8; k++) {
        s += dct_buffer[8 * i + k] * COSINE_ARRAY[k][j];
      }
      shapes[8 * i + j] = s;
    }
  }
};

const dequant_ydc = (val: number) => {
  const q = val << 1;
  let i: number;
  if (q >= 112) i = 192 + ((q - 112) << 2) + 2;
  else if (q >= 96) i = 160 + ((q - 96) << 1) + 1;
  else if (q >= 32) i = 96 + (q - 32);
  else if (q >= 16) i = 64 + ((q - 16) << 1) + 1;
  else i = (q << 2) + 2;
  return i << 3;
};

const dequant_cdc = (q: number) => {
  let i: number;
  if (q >= 63) i = 192 + 2;
  else if (q >= 56) i = 160 + ((q - 56) << 2) + 2;
  else if (q >= 48) i = 144 + ((q - 48) << 1) + 1;
  else if (q >= 16) i = 112 + (q - 16);
  else if (q >= 8) i = 96 + ((q - 8) << 1) + 1;
  else if (q > 0) i = 64 + (q << 2) + 2;
  else i = 32;
  return i << 3;
};

const dequant_ac = (val: number) => {
  if (val === 16) return 0;
  const q = (val << 3) + (val > 16 ? 4 : -4);
  const j = q - 128;
  const sign = j < 0 ? -1 : 1;
  const absJ = Math.abs(j);
  let absI: number;
  if (absJ >= 96) {
    absI = ((absJ - 64) << 2) + 2;
  } else if (absJ >= 64) {
    absI = ((absJ - 32) << 1) + 1;
  } else {
    absI = absJ;
  }
  return sign * absI;
};

export function getVideoFrameRect(imgElement: HTMLImageElement, colorTolerance = 5) {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  const width = imgElement.naturalWidth || imgElement.width;
  const height = imgElement.naturalHeight || imgElement.height;

  if (!ctx) {
    return { x: 0, y: 0, width, height };
  }

  canvas.width = width;
  canvas.height = height;
  ctx.drawImage(imgElement, 0, 0);
  const data = ctx.getImageData(0, 0, width, height).data;

  function isDark(x: number, y: number) {
    const i = (y * width + x) * 4;
    return (
      data[i] <= colorTolerance && data[i + 1] <= colorTolerance && data[i + 2] <= colorTolerance
    );
  }

  function isRowDark(y: number) {
    let darkPixelCount = 0;
    for (let x = 0; x < width; x++) {
      if (isDark(x, y)) darkPixelCount++;
    }
    return darkPixelCount > width * 0.95;
  }

  function isColDark(x: number) {
    let darkPixelCount = 0;
    for (let y = 0; y < height; y++) {
      if (isDark(x, y)) darkPixelCount++;
    }
    return darkPixelCount > height * 0.95;
  }

  let top: number, bottom: number, left: number, right: number;

  const centerY = Math.floor(height / 2);
  const centerX = Math.floor(width / 2);

  if (!isDark(centerX, centerY)) {
    top = centerY;
    bottom = centerY;
    left = centerX;
    right = centerX;
    while (top > 0 && !isRowDark(top - 1)) top--;
    while (bottom < height - 1 && !isRowDark(bottom + 1)) bottom++;
    while (left > 0 && !isColDark(left - 1)) left--;
    while (right < width - 1 && !isColDark(right + 1)) right++;
  } else {
    top = 0;
    bottom = height - 1;
    left = 0;
    right = width - 1;
    while (top < height && isRowDark(top)) top++;
    while (bottom > top && isRowDark(bottom)) bottom--;
    while (left < width && isColDark(left)) left++;
    while (right > left && isColDark(right)) right--;
  }

  return {
    x: left,
    y: top,
    width: right - left + 1,
    height: bottom - top + 1,
  };
}

export function getNearestAspectRatio(
  width: number,
  height: number,
  targetAspectRatios: number[],
  threshold = 0.05,
) {
  const aspectRatio = width / height;
  let bestRatio = null;
  let minDiff = Infinity;

  for (const targetRatio of targetAspectRatios) {
    const diff = Math.abs(aspectRatio - targetRatio);
    if (diff < minDiff) {
      minDiff = diff;
      bestRatio = targetRatio;
    }
  }

  if (minDiff <= threshold) {
    return bestRatio;
  }
  return null;
}

export function snapRectToNearestAspectRatio(
  rect: { x: number; y: number; width: number; height: number },
  maxW: number,
  maxH: number,
) {
  const targetRatios = [4 / 3, 16 / 9, 21 / 9];
  const currentRatio = rect.width / (rect.height || 1);
  let R = targetRatios[0];
  let minDiff = Math.abs(currentRatio - R);
  for (let i = 1; i < targetRatios.length; i++) {
    const diff = Math.abs(currentRatio - targetRatios[i]);
    if (diff < minDiff) {
      minDiff = diff;
      R = targetRatios[i];
    }
  }

  let w = rect.width;
  let h = rect.height;
  if (w / R > h) {
    w = h * R;
  } else {
    h = w / R;
  }

  if (w < 10) w = 10;
  if (h < 10) h = 10;

  const cx = rect.x + rect.width / 2;
  const cy = rect.y + rect.height / 2;
  let x = cx - w / 2;
  let y = cy - h / 2;

  if (x < 0) x = 0;
  if (y < 0) y = 0;
  if (x + w > maxW) {
    x = maxW - w;
    if (x < 0) {
      x = 0;
      w = maxW;
    }
  }
  if (y + h > maxH) {
    y = maxH - h;
    if (y < 0) {
      y = 0;
      h = maxH;
    }
  }

  return {
    x: Math.round(x),
    y: Math.round(y),
    width: Math.round(w),
    height: Math.round(h),
  };
}

export function getVectorFromImage(img: HTMLImageElement, cutBorders: boolean): number[] {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  const width = img.naturalWidth || img.width;
  const height = img.naturalHeight || img.height;

  if (!ctx) return [];

  canvas.width = width;
  canvas.height = height;
  ctx.drawImage(img, 0, 0);

  let cropX = 0;
  let cropY = 0;
  let cropW = width;
  let cropH = height;

  if (cutBorders) {
    const targetRatios = [4 / 3, 16 / 9, 21 / 9];
    const matchedRatio = getNearestAspectRatio(width, height, targetRatios);
    if (matchedRatio === null) {
      const detected = getVideoFrameRect(img);
      const snapped = snapRectToNearestAspectRatio(detected, width, height);
      cropX = snapped.x;
      cropY = snapped.y;
      cropW = snapped.width;
      cropH = snapped.height;
    }
  }

  const { data } = ctx.getImageData(cropX, cropY, cropW, cropH);
  return ColorLayout.extract({ data, width: cropW, height: cropH, channels: 4 });
}

export function getImageFromVector(vector: number[]): ImageData {
  const shape0 = new Float32Array(64);
  const shape1 = new Float32Array(64);
  const shape2 = new Float32Array(64);

  shape0[0] = dequant_ydc(vector[0] || 0);
  shape1[0] = dequant_cdc(vector[21] || 0);
  shape2[0] = dequant_cdc(vector[27] || 0);

  for (let i = 1; i < 21; i++) {
    shape0[ZIG_ZAG_ARRAY[i]] = dequant_ac(vector[i] ?? 16) << 1;
  }
  for (let i = 1; i < 6; i++) {
    shape1[ZIG_ZAG_ARRAY[i]] = dequant_ac(vector[21 + i] ?? 16);
    shape2[ZIG_ZAG_ARRAY[i]] = dequant_ac(vector[27 + i] ?? 16);
  }

  const outY = new Float32Array(64);
  const outCb = new Float32Array(64);
  const outCr = new Float32Array(64);

  Idct(shape0, outY);
  Idct(shape1, outCb);
  Idct(shape2, outCr);

  const rgba = new Uint8ClampedArray(8 * 8 * 4);
  for (let i = 0; i < 64; i++) {
    const Y = outY[i];
    const Cb = outCb[i];
    const Cr = outCr[i];

    const yy = (Y - 16) / 219;
    const B_norm = yy + (Cb - 128) / 126.336;
    const R_norm = yy + (Cr - 128) / 159.712;
    const G_norm = (yy - 0.299 * R_norm - 0.114 * B_norm) / 0.587;

    const R = Math.round(Math.max(0, Math.min(255, R_norm * 256)));
    const G = Math.round(Math.max(0, Math.min(255, G_norm * 256)));
    const B = Math.round(Math.max(0, Math.min(255, B_norm * 256)));

    const idx = i * 4;
    rgba[idx] = R;
    rgba[idx + 1] = G;
    rgba[idx + 2] = B;
    rgba[idx + 3] = 255;
  }

  if (typeof ImageData !== "undefined") {
    return new ImageData(rgba, 8, 8);
  }
  return { data: rgba, width: 8, height: 8, colorSpace: "srgb" } as ImageData;
}

export function getImageDataURLFromVector(vector: number[]): string {
  if (typeof document === "undefined") return "";
  const canvas = document.createElement("canvas");
  canvas.width = 8;
  canvas.height = 8;
  const ctx = canvas.getContext("2d");
  if (!ctx) return "";
  const imgData = getImageFromVector(vector);
  ctx.putImageData(imgData, 0, 0);
  return canvas.toDataURL();
}
