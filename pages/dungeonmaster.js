import { useEffect, useState } from "react";
import { useSocket } from "@/context/socketContext";

export default function DungeonMaster() {
  const socket = useSocket();
  const [turns, setTurns] = useState([]);

  useEffect(() => {
    if (socket) {
      socket.on("newTurn", (turnData) => {
        // Prevent duplicate entries
        setTurns((prevTurns) => {
          const isDuplicate = prevTurns.some(
            (turn) =>
              turn.playerName === turnData.playerName &&
              turn.timestamp === turnData.timestamp
          );
          return isDuplicate ? prevTurns : [...prevTurns, turnData];
        });
      });
    }
  }, [socket]);

  // Helper function to capitalize first letter
  const capitalize = (str) =>
    str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

  // Format free actions
  const formatFreeAction = (action) => {
    if (action === "dropItem") return "Drop Item";
    return capitalize(action);
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Dungeon Master</h1>
      {turns.length === 0 ? (
        <p>No turns submitted yet.</p>
      ) : (
        turns.map((turn, index) => (
          <div
            key={index}
            style={{
              marginBottom: "1rem",
              padding: "1rem",
              border: "1px solid #ccc",
              borderRadius: "0.5rem",
            }}
          >
            <p><strong>Player Name:</strong> {turn.playerName}</p>
            <p>
              <strong>Status Effects:</strong>{" "}
              {Array.isArray(turn.statusEffects) && turn.statusEffects.length > 0
                ? turn.statusEffects.map(capitalize).join(", ")
                : "None"}
            </p>
            <p><strong>Fatigue:</strong> {turn.fatigue || 0}</p>
            <p><strong>Wounds:</strong> {turn.wounds || 0}</p>
            <p>
              <strong>Penalties:</strong>
              <ul style={{ marginLeft: "2rem" }}>
                {Array.isArray(turn.penalties) && turn.penalties.length > 0 ? (
                  turn.penalties.map((penalty, i) => <li key={i}>{penalty}</li>)
                ) : (
                  <li>None</li>
                )}
              </ul>
            </p>
            <p>
              <strong>Free Actions:</strong>
              <ul style={{ marginLeft: "2rem" }}>
                {Array.isArray(turn.freeActions) && turn.freeActions.length > 0 ? (
                  turn.freeActions.map((action, i) => (
                    <li key={i}>{formatFreeAction(action)}</li>
                  ))
                ) : (
                  <li>None</li>
                )}
              </ul>
            </p>
            <p>
              <strong>Main Actions:</strong>
              <ul style={{ marginLeft: "2rem" }}>
                {Array.isArray(turn.mainActions) && turn.mainActions.length > 0 ? (
                  turn.mainActions.map((action, i) => <li key={i}>{action}</li>)
                ) : (
                  <li>None</li>
                )}
              </ul>
            </p>
            <p><strong>Timestamp:</strong> {turn.timestamp}</p>
          </div>
        ))
      )}
    </div>
  );
}

