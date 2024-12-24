import cn from "classnames";
import { useState, ChangeEvent, useRef } from "react";
import { RiSidebarFoldLine, RiSidebarUnfoldLine } from "react-icons/ri";
import { useLiveAPIContext } from "../../contexts/LiveAPIContext";
import "./side-panel.scss";

interface Message {
  text: string;
}

interface SidePanelProps {
  onStartSimulation: () => void;
  showFeedbackButton: boolean;
  onFeedbackRequest: () => void;
}

export default function SidePanel({
  onStartSimulation,
  showFeedbackButton,
  onFeedbackRequest,
}: SidePanelProps) {
  const { client, connected, disconnect } = useLiveAPIContext(); // Use the hook inside SidePanel
  const [open, setOpen] = useState(true);
  const [selectedScenario, setSelectedScenario] = useState("");
  const [selectedComplexity, setSelectedComplexity] = useState<
    "1" | "2" | "3" | "4" | "5"
  >("3");

  const handleScenarioChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setSelectedScenario(event.target.value);
  };

  const handleComplexityChange = (level: "1" | "2" | "3" | "4" | "5") => {
    setSelectedComplexity(level);
  };

  const handleSubmit = () => {
    onStartSimulation();
    const masterPromptStart =
      "You are acting as a emergency dispatch caller, you have called 911 and your emergency is ";
    const masterPromptEnd =
      ", talk in a human tone, stutter, pause randomly, mispronounce, be in a hurry, use filler words, and sometimes randomly interrupt and also do accents Now we will start the simulation Say I am Ready Please go ahead and Say to me 'To Start the Simulation say 911 whats your emergency'";

    let scenarioText = "";
    switch (selectedScenario) {
      case "medical":
        scenarioText =
          "a Medical Emergency (e.g., Cardiac Arrest, Stroke)";
        break;
      case "traffic":
        scenarioText =
          "a Traffic Accident (e.g., Single Vehicle, Multi-Vehicle, Pedestrian Involved)";
        break;
      case "fire":
        scenarioText = "a Fire (e.g., Residential, Commercial, Wildfire)";
        break;
      case "activeShooter":
        scenarioText = "an Active Shooter";
        break;
      case "domesticDisturbance":
        scenarioText = "a Domestic Disturbance";
        break;
      case "suspiciousActivity":
        scenarioText =
          "Suspicious Activity (e.g., Person, Package)";
        break;
      case "robbery":
        scenarioText =
          "a Robbery in Progress (e.g., Bank, Store, Home Invasion)";
        break;
      case "missingPerson":
        scenarioText =
          "a Missing Person (e.g., Child, Elderly, Runaway)";
        break;
      case "naturalDisaster":
        scenarioText =
          "a Natural Disaster (e.g., Flood, Earthquake, Tornado)";
        break;
      case "mentalHealthCrisis":
        scenarioText =
          "a Mental Health Crisis (e.g., Suicidal Person, Erratic Behavior)";
        break;
      default:
        scenarioText = "an unspecified emergency";
    }

    const fullPrompt = `${masterPromptStart} ${scenarioText} and you should make the conversation/difficulty of the simulation level ${selectedComplexity} ${masterPromptEnd}`;

    const messageToSend: Message = { text: fullPrompt };

    client.send([messageToSend]);
    setSelectedScenario(""); // Reset selections
    setSelectedComplexity("3");
  };

  const handleFeedbackRequest = () => {
    const feedbackMessage =
      "Ok now lets stop this simuation , Give me detailed and indepth feedback on my performance according to protocols and also give me suggestions on where i can improve , talk for atleast 30 seconds , now go";
    client.send([
      {
        text: feedbackMessage,
      },
    ]);
    disconnect();
    onFeedbackRequest(); // Hide feedback button after sending message
  };

  return (
    <div
      className={cn("side-panel", {
        open: open,
      })}
    >
      <header className="top">
        <h2>Command Panel</h2>
        {open ? (
          <button className="opener" onClick={() => setOpen(false)}>
            <RiSidebarFoldLine />
          </button>
        ) : (
          <button className="opener" onClick={() => setOpen(true)}>
            <RiSidebarUnfoldLine />
          </button>
        )}
      </header>

      <div className="input-container">
        <div className="instructions-box">
          <h3>Instructions To Demo Scenario Weaver</h3>
          <ol>
            <li>Start Voice Streaming By Clicking on the Play Button</li>
            <li>Select Your Scenario and Complexity Level</li>
            <li>Now Click On Start Scenario</li>
            <li>
              Say "911 Whats Your Emergency" to start the simulation
            </li>
            <li>
              After 3 Minutes the simulation will end and You will be given
              Feedback on your performance
            </li>
          </ol>
        </div>
        <div className="input-content">
          {/* Scenario Choice */}
          <div className="scenario-selection">
            <label htmlFor="scenario-choice">Scenario Choice:</label>
            <select
              id="scenario-choice"
              value={selectedScenario}
              onChange={handleScenarioChange}
            >
              <option value="">Select Scenario</option>
              <option value="medical">Medical Emergency</option>
              <option value="traffic">Traffic Accident</option>
              <option value="fire">Fire</option>
              <option value="activeShooter">Active Shooter</option>
              <option value="domesticDisturbance">
                Domestic Disturbance
              </option>
              <option value="suspiciousActivity">
                Suspicious Activity
              </option>
              <option value="robbery">Robbery in Progress</option>
              <option value="missingPerson">Missing Person</option>
              <option value="naturalDisaster">Natural Disaster</option>
              <option value="mentalHealthCrisis">
                Mental Health Crisis
              </option>
            </select>
          </div>

          {/* Complexity Level */}
          <div className="complexity-selection">
            <label>Complexity Level:</label>
            <div className="complexity-buttons">
              <button
                className={cn({ selected: selectedComplexity === "1" })}
                onClick={() => handleComplexityChange("1")}
              >
                1
              </button>
              <button
                className={cn({ selected: selectedComplexity === "2" })}
                onClick={() => handleComplexityChange("2")}
              >
                2
              </button>
              <button
                className={cn({ selected: selectedComplexity === "3" })}
                onClick={() => handleComplexityChange("3")}
              >
                3
              </button>
              <button
                className={cn({ selected: selectedComplexity === "4" })}
                onClick={() => handleComplexityChange("4")}
              >
                4
              </button>
              <button
                className={cn({ selected: selectedComplexity === "5" })}
                onClick={() => handleComplexityChange("5")}
              >
                5
              </button>
            </div>
          </div>

          <button
            className="send-button"
            onClick={handleSubmit}
            disabled={!connected || !selectedScenario || !selectedComplexity}
          >
            Start Simulation
          </button>
          {/* Feedback Button */}
          {showFeedbackButton && (
            <button className="feedback-button" onClick={handleFeedbackRequest}>
              Performance Feedback
            </button>
          )}
        </div>
      </div>
    </div>
  );
}