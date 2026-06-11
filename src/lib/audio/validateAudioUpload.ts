const allowedAudioMimeTypes = new Set([
  "audio/webm",
  "video/webm",
  "audio/wav",
  "audio/x-wav",
  "audio/mpeg",
  "audio/mp3",
  "audio/mp4",
  "audio/x-m4a",
  "video/mp4",
  "audio/ogg",
  "video/ogg",
]);

export function normalizeAudioMimeType(mimeType: string) {
  return mimeType.split(";")[0]?.trim().toLowerCase() ?? "";
}

export function isAllowedAudioMimeType(mimeType: string) {
  return allowedAudioMimeTypes.has(normalizeAudioMimeType(mimeType));
}

export function getAudioFileExtension(mimeType: string) {
  const normalizedMimeType = normalizeAudioMimeType(mimeType);

  if (normalizedMimeType.includes("mp4") || normalizedMimeType.includes("m4a")) return "m4a";
  if (normalizedMimeType.includes("mpeg") || normalizedMimeType.includes("mp3")) return "mp3";
  if (normalizedMimeType.includes("wav")) return "wav";
  if (normalizedMimeType.includes("ogg")) return "ogg";
  return "webm";
}

function readAscii(bytes: Uint8Array, start: number, end: number) {
  return String.fromCharCode(...bytes.slice(start, end));
}

export function hasValidAudioSignature(bytes: Uint8Array) {
  if (bytes[0] === 0x1a && bytes[1] === 0x45 && bytes[2] === 0xdf && bytes[3] === 0xa3) return true;
  if (readAscii(bytes, 0, 4) === "RIFF" && readAscii(bytes, 8, 12) === "WAVE") return true;
  if (readAscii(bytes, 0, 3) === "ID3") return true;
  if (bytes[0] === 0xff && (bytes[1] & 0xe0) === 0xe0) return true;
  if (readAscii(bytes, 4, 8) === "ftyp") return true;
  return readAscii(bytes, 0, 4) === "OggS";
}
