import { useEffect, useRef, useState } from "react";
import type { DurationSeconds } from "../../types/topic";

export type RecordingStatus =
  | "idle"
  | "preparing"
  | "countdown"
  | "recording"
  | "preview"
  | "error";

const mimeTypes = [
  "audio/webm;codecs=opus",
  "audio/webm",
  "audio/mp4;codecs=mp4a.40.2",
  "audio/mp4",
  "audio/ogg;codecs=opus",
  "audio/ogg",
  "audio/mpeg",
  "audio/wav",
];

function getSupportedMimeType() {
  if (typeof MediaRecorder === "undefined") return "";
  return mimeTypes.find((mimeType) => MediaRecorder.isTypeSupported(mimeType)) ?? "";
}

export function useSpeechRecorder(durationSeconds: DurationSeconds) {
  const [status, setStatus] = useState<RecordingStatus>("idle");
  const [error, setError] = useState("");
  const [countdown, setCountdown] = useState(3);
  const [remainingSeconds, setRemainingSeconds] = useState<number>(durationSeconds);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState("");
  const [mimeType, setMimeType] = useState("");

  const recorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const audioUrlRef = useRef("");
  const countdownTimeoutRef = useRef<number | null>(null);
  const timerIntervalRef = useRef<number | null>(null);
  const endsAtRef = useRef(0);

  function clearCountdown() {
    if (countdownTimeoutRef.current !== null) {
      window.clearTimeout(countdownTimeoutRef.current);
      countdownTimeoutRef.current = null;
    }
  }

  function clearTimer() {
    if (timerIntervalRef.current !== null) {
      window.clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
  }

  function stopStream() {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
  }

  function clearPreviewUrl() {
    if (audioUrlRef.current) {
      URL.revokeObjectURL(audioUrlRef.current);
      audioUrlRef.current = "";
    }
  }

  function resetRecording() {
    clearCountdown();
    clearTimer();
    recorderRef.current = null;
    chunksRef.current = [];
    stopStream();
    clearPreviewUrl();
    setStatus("idle");
    setError("");
    setCountdown(3);
    setRemainingSeconds(durationSeconds);
    setAudioBlob(null);
    setAudioUrl("");
    setMimeType("");
  }

  function stopRecording() {
    clearCountdown();
    clearTimer();

    if (recorderRef.current?.state === "recording") {
      recorderRef.current.stop();
      return;
    }

    stopStream();
  }

  async function startRecording() {
    if (status === "preparing" || status === "countdown" || status === "recording") return;

    resetRecording();
    setStatus("preparing");
    setRemainingSeconds(durationSeconds);

    if (
      typeof window === "undefined" ||
      typeof MediaRecorder === "undefined" ||
      !navigator.mediaDevices?.getUserMedia
    ) {
      setStatus("error");
      setError("This browser does not support microphone recording. Try a current version of Chrome, Edge, or Safari.");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const supportedMimeType = getSupportedMimeType();
      const recorder = supportedMimeType
        ? new MediaRecorder(stream, { mimeType: supportedMimeType })
        : new MediaRecorder(stream);

      streamRef.current = stream;
      recorderRef.current = recorder;
      chunksRef.current = [];
      setMimeType(recorder.mimeType || supportedMimeType || "audio/webm");

      recorder.addEventListener("dataavailable", (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      });

      recorder.addEventListener("stop", () => {
        const blob = new Blob(chunksRef.current, { type: recorder.mimeType || "audio/webm" });

        if (blob.size === 0) {
          setStatus("error");
          setError("No audio was captured. Check your microphone and try again.");
          stopStream();
          return;
        }

        const previewUrl = URL.createObjectURL(blob);
        audioUrlRef.current = previewUrl;
        setAudioBlob(blob);
        setAudioUrl(previewUrl);
        setStatus("preview");
        stopStream();
      });

      setStatus("countdown");
      setCountdown(3);

      function tickCountdown(nextValue: number) {
        setCountdown(nextValue);

        if (nextValue === 0) {
          try {
            recorder.start();
          } catch {
            setStatus("error");
            setError("Recording could not start. Refresh the page and try again.");
            stopStream();
            return;
          }

          setStatus("recording");
          endsAtRef.current = Date.now() + durationSeconds * 1000;
          setRemainingSeconds(durationSeconds);
          timerIntervalRef.current = window.setInterval(() => {
            const nextRemaining = Math.max(0, Math.ceil((endsAtRef.current - Date.now()) / 1000));
            setRemainingSeconds(nextRemaining);

            if (nextRemaining === 0) {
              stopRecording();
            }
          }, 250);
          return;
        }

        countdownTimeoutRef.current = window.setTimeout(() => tickCountdown(nextValue - 1), 1000);
      }

      countdownTimeoutRef.current = window.setTimeout(() => tickCountdown(2), 1000);
    } catch (caughtError) {
      stopStream();
      setStatus("error");
      setError(
        caughtError instanceof DOMException && caughtError.name === "NotAllowedError"
          ? "Microphone permission was blocked. Allow microphone access in your browser and try again."
          : "The microphone could not be started. Check your input device and try again."
      );
    }
  }

  useEffect(() => {
    if (status === "idle") {
      setRemainingSeconds(durationSeconds);
    }
  }, [durationSeconds, status]);

  useEffect(() => {
    return () => {
      if (countdownTimeoutRef.current !== null) {
        window.clearTimeout(countdownTimeoutRef.current);
      }

      if (timerIntervalRef.current !== null) {
        window.clearInterval(timerIntervalRef.current);
      }

      streamRef.current?.getTracks().forEach((track) => track.stop());

      if (audioUrlRef.current) {
        URL.revokeObjectURL(audioUrlRef.current);
      }
    };
  }, []);

  return {
    status,
    error,
    countdown,
    remainingSeconds,
    audioBlob,
    audioUrl,
    mimeType,
    startRecording,
    stopRecording,
    resetRecording,
  };
}
