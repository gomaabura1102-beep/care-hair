import type { HairPhotoAnalysis } from "@/types/photo-diagnosis";

const fallbackMessage = "写真から髪質を正確に判断できませんでした。質問内容のみで診断します。";

export async function analyzeHairPhoto(file: File): Promise<HairPhotoAnalysis> {
  const image = await createImageBitmap(file);
  const canvas = document.createElement("canvas");
  const size = 160;
  canvas.width = size;
  canvas.height = size;

  const context = canvas.getContext("2d");
  if (!context) {
    return createFallbackResult();
  }

  context.drawImage(image, 0, 0, size, size);
  const pixels = context.getImageData(0, 0, size, size).data;
  let brightnessTotal = 0;
  let darkPixels = 0;
  let highlightPixels = 0;

  for (let i = 0; i < pixels.length; i += 4) {
    const brightness = (pixels[i] + pixels[i + 1] + pixels[i + 2]) / 3;
    brightnessTotal += brightness;
    if (brightness < 60) darkPixels += 1;
    if (brightness > 190) highlightPixels += 1;
  }

  const pixelCount = pixels.length / 4;
  const brightness = brightnessTotal / pixelCount;
  const darkRatio = darkPixels / pixelCount;
  const highlightRatio = highlightPixels / pixelCount;

  if (image.width < 360 || image.height < 360 || file.size < 30_000) {
    return createFallbackResult();
  }

  if (brightness < 45 || brightness > 235) {
    return createFallbackResult();
  }

  if (darkRatio < 0.04 && highlightRatio > 0.78) {
    return createFallbackResult();
  }

  const likelyDarkHair = darkRatio > 0.18;
  const likelyShiny = highlightRatio > 0.16;
  const likelyDry = highlightRatio < 0.08 && brightness > 120;
  const likelyFrizzy = darkRatio > 0.28 || brightness < 95;

  return {
    usable: true,
    message: "写真の状態を診断に反映します。",
    scores: {
      fine: likelyDarkHair ? 1 : 2,
      normal: 2,
      coarse: likelyFrizzy ? 2 : 0,
      curly: likelyFrizzy ? 2 : 0,
      straight: likelyFrizzy ? 0 : 2,
      dry: likelyDry ? 3 : 1,
      damage: likelyShiny ? 0 : 2,
      frizz: likelyFrizzy ? 3 : 1,
      smooth: likelyShiny ? 2 : 0
    },
    metrics: [
      { label: "髪質", value: likelyFrizzy ? "やや広がりやすい傾向" : "扱いやすい傾向" },
      { label: "くせ毛レベル", value: likelyFrizzy ? "中" : "低" },
      { label: "ボリューム", value: likelyDarkHair ? "普通〜多め" : "普通" },
      { label: "ダメージ具合", value: likelyShiny ? "少なめ" : "やや注意" },
      { label: "ツヤ", value: likelyShiny ? "出やすい" : "控えめ" },
      { label: "乾燥傾向", value: likelyDry ? "あり" : "少なめ" },
      { label: "広がりやすさ", value: likelyFrizzy ? "あり" : "少なめ" }
    ]
  };
}

function createFallbackResult(): HairPhotoAnalysis {
  return {
    usable: false,
    message: fallbackMessage,
    scores: {},
    metrics: []
  };
}
