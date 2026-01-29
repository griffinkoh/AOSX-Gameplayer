import { useEffect, useState } from "react";

export function useGameTimer(running: boolean, resetKey: number) {
  const [time, setTime] = useState(0);

  useEffect(() => {
    setTime(0); // reset to 0
  }, [resetKey]);

  useEffect(() => {
    if (!running) return;
    const interval = setInterval(() => {
      setTime(prev => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [running]);

  return time;
}
