import { describe, expect, it } from "vitest";
import { getAudioFileExtension, hasValidAudioSignature, isAllowedAudioMimeType, normalizeAudioMimeType } from "./validateAudioUpload";

describe("audio upload validation", () => {
  it("normalizes browser MIME types with codec parameters", () => {
    expect(normalizeAudioMimeType("audio/webm;codecs=opus")).toBe("audio/webm");
    expect(normalizeAudioMimeType(" AUDIO/MP4; codecs=mp4a.40.2 ")).toBe("audio/mp4");
  });

  it("accepts common browser recording MIME types", () => {
    expect(isAllowedAudioMimeType("audio/webm;codecs=opus")).toBe(true);
    expect(isAllowedAudioMimeType("audio/mp4;codecs=mp4a.40.2")).toBe(true);
    expect(isAllowedAudioMimeType("audio/mpeg")).toBe(true);
  });

  it("rejects unsupported declared types", () => {
    expect(isAllowedAudioMimeType("text/plain")).toBe(false);
    expect(isAllowedAudioMimeType("application/octet-stream")).toBe(false);
  });

  it("recognizes supported audio signatures", () => {
    expect(hasValidAudioSignature(new Uint8Array([0x1a, 0x45, 0xdf, 0xa3, 0, 0, 0, 0, 0, 0, 0, 0]))).toBe(true);
    expect(hasValidAudioSignature(new Uint8Array([82, 73, 70, 70, 0, 0, 0, 0, 87, 65, 86, 69]))).toBe(true);
    expect(hasValidAudioSignature(new Uint8Array([79, 103, 103, 83, 0, 0, 0, 0, 0, 0, 0, 0]))).toBe(true);
  });

  it("rejects unsupported signatures", () => {
    expect(hasValidAudioSignature(new Uint8Array([78, 79, 84, 65, 85, 68, 73, 79, 0, 0, 0, 0]))).toBe(false);
  });

  it("chooses file extensions from normalized MIME types", () => {
    expect(getAudioFileExtension("audio/webm;codecs=opus")).toBe("webm");
    expect(getAudioFileExtension("audio/mp4;codecs=mp4a.40.2")).toBe("m4a");
    expect(getAudioFileExtension("audio/ogg;codecs=opus")).toBe("ogg");
  });
});
