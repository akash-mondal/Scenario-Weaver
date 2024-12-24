import React, { useState, useEffect } from "react";
import { useLiveAPIContext } from "../../contexts/LiveAPIContext";

interface TimerProps {
  duration: number; // Duration in seconds
  onTimerEnd: () => void;
}

const Timer: React.FC<TimerProps> = ({ duration, onTimerEnd }) => {
  const [secondsRemaining, setSecondsRemaining] = useState(duration);
  const { connected, disconnect } = useLiveAPIContext();

  useEffect(() => {
    setSecondsRemaining(duration);
  }, [duration]);

  useEffect(() => {
    if (!connected) {
      return;
    }

    const intervalId = setInterval(() => {
      setSecondsRemaining((prevSeconds) => {
        if (prevSeconds <= 0) {
          clearInterval(intervalId);
          onTimerEnd();
          return 0;
        }
        return prevSeconds - 1;
      });
    }, 1000);

    return () => clearInterval(intervalId);
  }, [connected, onTimerEnd]);

  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;

  return (
    <div className="timer">
      {connected ? (
        <h2 className="timer-display">
          {minutes.toString().padStart(2, "0")}:
          {seconds.toString().padStart(2, "0")}
        </h2>
      ) : null}
    </div>
  );
};

export default Timer;
