import { useState, useEffect } from "react";
import { useGameState } from "../context/GameStateContext";

export default function FreeActions({ setFreeActions }) {
  const { setActions } = useGameState();
  const [selectedActions, setSelectedActions] = useState({
    move: false,
    speak: false,
    prone: false,
    dropItem: false,
    other: false,
  });

  const toggleAction = (action) => {
    const updatedActions = {
      ...selectedActions,
      [action]: !selectedActions[action],
    };

    setSelectedActions(updatedActions);

    // Check if any free actions are selected
    const hasSelectedActions = Object.values(updatedActions).some((value) => value);

    // Update shared actions state
    setActions((prev) => ({
      ...prev,
      freeActionUsed: hasSelectedActions,
    }));
  };

  // Update parent state whenever selected actions change
  useEffect(() => {
    setFreeActions(selectedActions);
  }, [selectedActions, setFreeActions]);

    return (
  <div style={{ padding: "1rem", borderTop: "1px solid #ccc" }}>
    <h3 style={{ marginBottom: "0.5rem" }}>
      FREE ACTIONS: <small>Choose as many as you like!</small>
    </h3>
    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
      <label>
        <input
          type="checkbox"
          checked={selectedActions.move}
          onChange={() => toggleAction("move")}
        />
        Move
      </label>
      <label>
        <input
          type="checkbox"
          checked={selectedActions.speak}
          onChange={() => toggleAction("speak")}
        />
        Talk
      </label>
      <label>
        <input
          type="checkbox"
          checked={selectedActions.prone}
          onChange={() => toggleAction("prone")}
        />
        Prone
      </label>
      <label>
        <input
          type="checkbox"
          checked={selectedActions.dropItem}
          onChange={() => toggleAction("dropItem")}
        />
        Drop Item
      </label>
      <label>
        <input
          type="checkbox"
          checked={selectedActions.other}
          onChange={() => toggleAction("other")}
        />
        Other (ask Chad)
      </label>
    </div>
  </div>
);
}

