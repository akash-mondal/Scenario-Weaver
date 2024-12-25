import { useRef, useState } from "react";
import "./App.scss";
import { LiveAPIProvider } from "./contexts/LiveAPIContext";
import SidePanel from "./components/side-panel/SidePanel";
import { Altair } from "./components/altair/Altair";
import ControlTray from "./components/control-tray/ControlTray";
import cn from "classnames";
import Timer from "./components/timer/Timer";
import { FaLinkedin, FaGithub } from "react-icons/fa";

const API_KEY = process.env.REACT_APP_GEMINI_API_KEY as string;
if (typeof API_KEY !== "string") {
  throw new Error("set REACT_APP_GEMINI_API_KEY in .env");
}

const host = "generativelanguage.googleapis.com";
const uri = `wss://${host}/ws/google.ai.generativelanguage.v1alpha.GenerativeService.BidiGenerateContent`;

function App() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoStream, setVideoStream] = useState<MediaStream | null>(null);
  const [showTimer, setShowTimer] = useState(false);
  const [simulationStarted, setSimulationStarted] = useState(false);

  const handleTimerEnd = () => {
    setSimulationStarted(false);
    setShowTimer(false);
  };

  return (
    <div className="App">
      <LiveAPIProvider url={uri} apiKey={API_KEY}>
        <div className="streaming-console">
          <SidePanel
            onStartSimulation={() => {
              setShowTimer(true);
              setSimulationStarted(true);
            }}
          />
          <main>
            <h1 className="app-title">
              SCENARIO WEAVER
            </h1> {/* Add title here */}
            <Altair />
            <video
              className={cn("stream", {
                hidden: !videoRef.current || !videoStream,
              })}
              ref={videoRef}
              autoPlay
              playsInline
            />
            <ControlTray
              videoRef={videoRef}
              supportsVideo={true}
              onVideoStreamChange={setVideoStream}
              simulationStarted={simulationStarted}
            />
            {showTimer && (
              <Timer duration={180} onTimerEnd={handleTimerEnd} />
            )}

            <div className="footer">
              <p>Made by ⭐Shrestha Singh⭐</p>
              <div className="social-links">
                <a
                  href="https://www.linkedin.com/in/shrestha-singh-/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                >
                  <FaLinkedin />
                </a>
                <a
                  href="https://github.com/shresthasingh1501"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub"
                >
                  <FaGithub />
                </a>
              </div>
            </div>
          </main>
        </div>
      </LiveAPIProvider>
    </div>
  );
}

export default App;