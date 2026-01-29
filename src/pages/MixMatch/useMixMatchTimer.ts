import { useCallback, useEffect, useMemo, useRef, useState } from "react";

function fmt(ms: number) {
  const totalSec = Math.floor(ms / 1000);
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  const mm = String(m).padStart(2, "0");
  const ss = String(s).padStart(2, "0");
  return `${mm}:${ss}`;
}

export function useMixMatchTimer() {
  const [running, setRunning] = useState(false);
  const [elapsedMs, setElapsedMs] = useState(0);

  const startAtRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);

  const tick = useCallback(() => {
    if (!running || startAtRef.current === null) return;
    const now = Date.now();
    setElapsedMs(now - startAtRef.current);
    rafRef.current = window.requestAnimationFrame(tick);
  }, [running]);

  useEffect(() => {
    if (!running) return;
    rafRef.current = window.requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) window.cancelAnimationFrame(rafRef.current);
    };
  }, [running, tick]);

  const startIfNeeded = useCallback(() => {
    if (running) return;
    if (startAtRef.current === null) {
      startAtRef.current = Date.now() - elapsedMs;
    } else {
      startAtRef.current = Date.now() - elapsedMs;
    }
    setRunning(true);
  }, [running, elapsedMs]);

  const stop = useCallback(() => {
    setRunning(false);
  }, []);

  const reset = useCallback(() => {
    setRunning(false);
    startAtRef.current = null;
    setElapsedMs(0);
  }, []);

  const formatted = useMemo(() => fmt(elapsedMs), [elapsedMs]);

  return {
    started: startAtRef.current !== null,
    running,
    elapsedMs,
    formatted,
    startIfNeeded,
    stop,
    reset,
  };
}
