export const maxStoredImageBytes = 4 * 1024 * 1024;

export class ImageValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ImageValidationError";
  }
}

export type SanitizedImageInspection = {
  width: number;
  height: number;
  mimeType: "image/jpeg" | "image/webp";
  extension: "jpg" | "webp";
};

export function inspectSanitizedImage(bytes: Buffer): SanitizedImageInspection {
  if (bytes.length < 30 || bytes.length > maxStoredImageBytes) {
    throw new ImageValidationError("写真のファイルサイズが正しくありません。");
  }
  if (
    bytes.includes(Buffer.from("EXIF")) ||
    bytes.includes(Buffer.from("Exif")) ||
    bytes.includes(Buffer.from("XMP ")) ||
    bytes.includes(Buffer.from("http://ns.adobe.com/xap/"))
  ) {
    throw new ImageValidationError("写真に不要なメタデータが残っています。");
  }

  const isWebp = bytes.toString("ascii", 0, 4) === "RIFF" && bytes.toString("ascii", 8, 12) === "WEBP";
  const isJpeg = bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
  const dimensions = isWebp ? readWebpDimensions(bytes) : isJpeg ? readJpegDimensions(bytes) : null;
  if (!isWebp && !isJpeg) {
    throw new ImageValidationError("安全に処理された画像ではありません。");
  }
  if (!dimensions || Math.min(dimensions.width, dimensions.height) < 400) {
    throw new ImageValidationError("髪全体が分かる、400px以上の写真を選んでください。");
  }
  if (Math.max(dimensions.width, dimensions.height) > 1600) {
    throw new ImageValidationError("写真の解像度が上限を超えています。");
  }
  return {
    ...dimensions,
    mimeType: isWebp ? "image/webp" : "image/jpeg",
    extension: isWebp ? "webp" : "jpg"
  };
}

function readJpegDimensions(bytes: Buffer): { width: number; height: number } | null {
  let offset = 2;
  while (offset + 8 < bytes.length) {
    if (bytes[offset] !== 0xff) {
      offset += 1;
      continue;
    }
    while (offset < bytes.length && bytes[offset] === 0xff) offset += 1;
    if (offset >= bytes.length) return null;
    const marker = bytes[offset];
    offset += 1;

    if (marker === 0xd9 || marker === 0xda) return null;
    if (marker === 0x01 || (marker >= 0xd0 && marker <= 0xd7)) continue;
    if (offset + 2 > bytes.length) return null;

    const segmentLength = bytes.readUInt16BE(offset);
    if (segmentLength < 2 || offset + segmentLength > bytes.length) return null;
    const isStartOfFrame =
      (marker >= 0xc0 && marker <= 0xc3) ||
      (marker >= 0xc5 && marker <= 0xc7) ||
      (marker >= 0xc9 && marker <= 0xcb) ||
      (marker >= 0xcd && marker <= 0xcf);
    if (isStartOfFrame) {
      if (segmentLength < 7) return null;
      return {
        height: bytes.readUInt16BE(offset + 3),
        width: bytes.readUInt16BE(offset + 5)
      };
    }
    offset += segmentLength;
  }
  return null;
}

function readWebpDimensions(bytes: Buffer): { width: number; height: number } | null {
  const chunk = bytes.toString("ascii", 12, 16);
  if (chunk === "VP8X" && bytes.length >= 30) {
    return {
      width: 1 + bytes.readUIntLE(24, 3),
      height: 1 + bytes.readUIntLE(27, 3)
    };
  }
  if (chunk === "VP8 " && bytes.length >= 30 && bytes[23] === 0x9d && bytes[24] === 0x01 && bytes[25] === 0x2a) {
    return {
      width: bytes.readUInt16LE(26) & 0x3fff,
      height: bytes.readUInt16LE(28) & 0x3fff
    };
  }
  if (chunk === "VP8L" && bytes.length >= 25 && bytes[20] === 0x2f) {
    const b1 = bytes[21];
    const b2 = bytes[22];
    const b3 = bytes[23];
    const b4 = bytes[24];
    return {
      width: 1 + (((b2 & 0x3f) << 8) | b1),
      height: 1 + (((b4 & 0x0f) << 10) | (b3 << 2) | ((b2 & 0xc0) >> 6))
    };
  }
  return null;
}
