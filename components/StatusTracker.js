import { useState } from "react";

const statusExplanations = {
  distracted: "You're distracted! -2 to trait rolls until the end of next turn",
  shaken: "You're SHOOK! You can't take actions, but you can move",
  vulnerable: "You left yourself open! +2 to attack you until end of next turn",
  entangled: "You are restrained! -2 to all actions and cannot move",
  bound: "You are helplessly restrained! No actions or movement possible",
};

const fatigueExplanations = {
  0: "No penalties from fatigue.",
  1: "-1 to all Trait rolls (Fatigue 1).",
  2: "-2 to all Trait rolls (Fatigue 2).",
  3: "Incapacitated (Fatigue 3).",
};

const woundExplanations = {
  0: "No penalties from wounds.",
  1: "-1 to Pace and Trait rolls (Wound 1).",
  2: "-2 to Pace and Trait rolls (Wound 2).",
  3: "-3 to Pace and Trait rolls (Wound 3).",
};

export default function StatusTracker({
  playerName,
  setPlayerName,
  statusEffects,
  setStatusEffects,
  fatigue,
  setFatigue,
  wounds,
  setWounds,
  currentPenalties,
  setCurrentPenalties,
}) {
  const [statuses, setStatuses] = useState({
    distracted: false,
    shaken: false,
    vulnerable: false,
    entangled: false,
    bound: false,
  });

  const toggleStatus = (status) => {
    setStatuses((prev) => {
      const newStatuses = { ...prev, [status]: !prev[status] };

      if (newStatuses[status]) {
        const newPenalty = `${statusExplanations[status]} (${status.charAt(0).toUpperCase() + status.slice(1)})`;
        setCurrentPenalties((prevPenalties) => [...prevPenalties, newPenalty]);
      } else {
        const penaltyToRemove = `${statusExplanations[status]} (${status.charAt(0).toUpperCase() + status.slice(1)})`;
        setCurrentPenalties((prevPenalties) =>
          prevPenalties.filter((penalty) => penalty !== penaltyToRemove)
        );
      }

      const updatedStatusEffects = Object.keys(newStatuses).filter((key) => newStatuses[key]);
      setStatusEffects(updatedStatusEffects); // Ensure it's always an array
      return newStatuses;
    });
  };

  const updateFatigue = (level) => {
    setCurrentPenalties((prevPenalties) =>
      prevPenalties.filter((penalty) => !penalty.includes("(Fatigue"))
    );
    if (level > 0) {
      setCurrentPenalties((prevPenalties) => [...prevPenalties, fatigueExplanations[level]]);
    }
    setFatigue(level);
  };

  const updateWounds = (level) => {
    setCurrentPenalties((prevPenalties) =>
      prevPenalties.filter((penalty) => !penalty.includes("(Wound"))
    );
    if (level > 0) {
      setCurrentPenalties((prevPenalties) => [...prevPenalties, woundExplanations[level]]);
    }
    setWounds(level);
  };

  return (
    <div
      style={{
        position: "sticky",
        top: 0,
        backgroundColor: "#fff",
        padding: "1rem",
        borderBottom: "1px solid #ccc",
        zIndex: 1000,
        display: "flex",
        gap: "2rem",
        alignItems: "center",
      }}
    >
      {/* Player Name */}
      <div>
        {playerName === "" ? (
          <div>
            <label htmlFor="name-select">Choose your name:</label>
            <select
              id="name-select"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
            >
              <option value="">-- Select --</option>
              <option value="Laura F.">Laura F.</option>
              <option value="Laura M.">Laura M.</option>
              <option value="Lauren">Lauren</option>
              <option value="Nick">Nick</option>
              <option value="Chad">Chad</option>
            </select>
          </div>
        ) : (
          <h2>Player: {playerName}</h2>
        )}
      </div>

      {/* Status Section */}
      <div>
        <h3>Status Effects</h3>
        <div style={{ display: "flex", gap: "1rem" }}>
          {Object.keys(statuses).map((status) => (
            <div key={status}>
              <label>
                <input
                  type="checkbox"
                  checked={statuses[status]}
                  onChange={() => toggleStatus(status)}
                />
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Fatigue Section */}
      <div>
        <h3>Fatigue</h3>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          {[0, 1, 2, 3].map((level) => (
            <label key={`fatigue-${level}`}>
              <input
                type="radio"
                name="fatigue"
                value={level}
                checked={fatigue === level}
                onChange={() => updateFatigue(level)}
              />
              {level}
            </label>
          ))}
        </div>
      </div>

      {/* Wounds Section */}
      <div>
        <h3>Wounds</h3>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          {[0, 1, 2, 3].map((level) => (
            <label key={`wounds-${level}`}>
              <input
                type="radio"
                name="wounds"
                value={level}
                checked={wounds === level}
                onChange={() => updateWounds(level)}
              />
              {level}
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}

