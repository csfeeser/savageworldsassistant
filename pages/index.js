import { useState } from "react";
import { useSocket } from "@/context/socketContext";
import StatusTracker from "@/components/StatusTracker";
import PenaltiesActionsTracker from "@/components/PenaltiesActionsTracker";
import FreeActions from "@/components/FreeActions";
import MainActions from "@/components/MainActions";

export default function Home() {
  const socket = useSocket();

  // Centralized state for all selections
  const [playerName, setPlayerName] = useState("");
  const [statusEffects, setStatusEffects] = useState([]); // Ensure it's always an array
  const [currentPenalties, setCurrentPenalties] = useState([]);
  const [fatigue, setFatigue] = useState(0);
  const [wounds, setWounds] = useState(0);
  const [freeActions, setFreeActions] = useState({});
  const [mainActions, setMainActions] = useState([]);
  const [actions, setActions] = useState({
    freeActionUsed: false,
    mainActionUsed: false,
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = () => {
    if (mainActions.length === 0) {
      setErrorMessage("You must select a main action!");
      setTimeout(() => setErrorMessage(""), 2000);
      return;
    }

    const turnData = {
      playerName: playerName || "Unknown",
      statusEffects: Array.isArray(statusEffects) ? [...statusEffects] : [], // Ensure it's iterable
      fatigue,
      wounds,
      penalties: Array.isArray(currentPenalties) ? [...currentPenalties] : [],
      freeActions: Object.entries(freeActions)
        .filter(([_, value]) => value)
        .map(([key]) => key),
      mainActions,
      timestamp: new Date().toLocaleString(),
    };

    console.log("Submitting turn data:", turnData);
    if (socket) {
      socket.emit("submitTurn", turnData);
    }

    // Show success message
    setSuccessMessage("Turn Complete!");
    setTimeout(() => setSuccessMessage(""), 2000);
  };

  return (
    <div>
      <div style={{ width: "100%" }}>
        <StatusTracker
          playerName={playerName}
          setPlayerName={setPlayerName}
          statusEffects={statusEffects}
          setStatusEffects={setStatusEffects}
          fatigue={fatigue}
          setFatigue={setFatigue}
          wounds={wounds}
          setWounds={setWounds}
          currentPenalties={currentPenalties}
          setCurrentPenalties={setCurrentPenalties}
        />
      </div>
      <div style={{ display: "flex", width: "100%", gap: "1rem" }}>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "1rem" }}>
          <PenaltiesActionsTracker
            currentPenalties={currentPenalties}
            setCurrentPenalties={setCurrentPenalties}
            actions={actions}
          />
          <FreeActions
            freeActions={freeActions}
            setFreeActions={setFreeActions}
            actions={actions}
            setActions={setActions}
          />
        </div>
        <div style={{ flex: 1 }}>
          <MainActions
            mainActions={mainActions}
            setMainActions={setMainActions}
            actions={actions}
            setActions={setActions}
          />
        </div>
      </div>
      <div style={{ textAlign: "center", marginTop: "1rem" }}>
        <button
          onClick={handleSubmit}
          style={{
            padding: "1rem 2rem",
            fontSize: "1.2rem",
            backgroundColor: "#007bff",
            color: "#fff",
            border: "none",
            borderRadius: "0.5rem",
            cursor: "pointer",
            transition: "background-color 0.2s, transform 0.1s",
          }}
          onMouseOver={(e) => (e.target.style.backgroundColor = "#0056b3")}
          onMouseOut={(e) => (e.target.style.backgroundColor = "#007bff")}
          onMouseDown={(e) => {
            e.target.style.transform = "scale(0.95)";
            e.target.style.backgroundColor = "#004494";
          }}
          onMouseUp={(e) => {
            e.target.style.transform = "scale(1)";
            e.target.style.backgroundColor = "#007bff";
          }}
        >
          Submit
        </button>
        {/* Error Message */}
        {errorMessage && (
          <p style={{ color: "red", marginTop: "0.5rem" }}>{errorMessage}</p>
        )}
        {/* Success Message */}
        {successMessage && (
          <p style={{ color: "green", marginTop: "0.5rem" }}>{successMessage}</p>
        )}
      </div>
    </div>
  );
}

