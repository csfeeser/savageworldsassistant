import { useEffect } from "react";

export default function PenaltiesActionsTracker({
  currentPenalties,
  actions,
  setCurrentPenalties,
}) {
  useEffect(() => {
    // Update penalties and actions
    const actionsSummary = [];
    if (!actions.freeActionUsed) actionsSummary.push("Free Action(s) available");
    if (!actions.mainActionUsed) actionsSummary.push("Main Action available");
  }, [currentPenalties, actions]);

  // Helper function to format penalties
  const formatPenalty = (penalty) => {
    // Handle known conditions like Wound, Fatigue, and other penalties
    const conditionPattern = /\((\w+)\s*(\d*)\)/; // Match conditions like (Wound 1), (Fatigue 2)
    const match = penalty.match(conditionPattern);

    if (match) {
      const [fullMatch, condition, level] = match;
      const description = penalty.replace(fullMatch, "").trim(); // Remove the condition part
      return (
        <span>
          <strong>{`${condition}${level ? " " + level : ""}:`}</strong> {description}
        </span>
      );
    }

    // Default: format other penalties (e.g., Distracted, Shaken)
    return penalty;
  };

  return (
    <div style={{ padding: "1rem", borderTop: "1px solid #ccc" }}>
      {/* Current Penalties Section */}
      <h3>Current Penalties:</h3>
      <div>
        {currentPenalties.length === 0 ? (
          <p>None</p>
        ) : (
          <ul style={{ marginLeft: "2rem" }}>
            {currentPenalties.map((penalty, index) => (
              <li key={index}>{formatPenalty(penalty)}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

