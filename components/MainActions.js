import { useEffect, useState } from "react";
import { useGameState } from "../context/GameStateContext";

export default function MainActions({ setMainActions }) {
  const { penalties, setPenalties } = useGameState();
  const [selectedAction, setSelectedAction] = useState("");
  const [attacks, setAttacks] = useState([]);
  const [spells, setSpells] = useState([]);

  useEffect(() => {
    // Update parent with the selected main action(s)
    const mainActionSummary = [];

    if (selectedAction === "attack") {
      attacks.forEach((attack, index) => {
        const type = attack.type ? `${attack.type.charAt(0).toUpperCase()}${attack.type.slice(1)}` : "Unspecified";
        const options = Object.keys(attack.options)
          .filter((opt) => attack.options[opt])
          .map((opt) => opt === "calledShot" ? "Called Shot" : opt);
        mainActionSummary.push(`${index + 1}. ${type} Attack (${options.join(", ") || "No options"})`);
      });
    } else if (selectedAction === "cast") {
      spells.forEach((_, index) => mainActionSummary.push(`${index + 1}. Spell`));
    } else if (selectedAction) {
      mainActionSummary.push(selectedAction.charAt(0).toUpperCase() + selectedAction.slice(1));
    }

    setMainActions(mainActionSummary);
  }, [selectedAction, attacks, spells, setMainActions]);

  const handleActionSelect = (action) => {
    setSelectedAction(action);
    if (action === "attack" && attacks.length === 0) {
      setAttacks([{ id: 1, type: "", options: {} }]);
    }
    if (action === "cast" && spells.length === 0) {
      setSpells([{ id: 1 }]);
    }
  };

  const resetActions = () => {
    setSelectedAction("");
    setAttacks([]);
    setSpells([]);
    setPenalties((prev) => prev.filter((penalty) => !penalty.startsWith("Multi-Action Penalty")));
    setMainActions([]);
  };

  const addAttack = () => {
    if (attacks.length < 3) {
      const newPenalty = -2 * attacks.length - 2;

      const updatedPenalties = penalties.filter(
        (penalty) => !penalty.startsWith("Multi-Action Penalty")
      );
      setPenalties([...updatedPenalties, `Multi-Action Penalty: ${newPenalty}`]);

      setAttacks((prev) => [...prev, { id: prev.length + 1, type: "", options: {} }]);
    }
  };

  const addSpell = () => {
    if (spells.length < 3) {
      const newPenalty = -2 * spells.length - 2;

      const updatedPenalties = penalties.filter(
        (penalty) => !penalty.startsWith("Multi-Action Penalty")
      );
      setPenalties([...updatedPenalties, `Multi-Action Penalty: ${newPenalty}`]);

      setSpells((prev) => [...prev, { id: prev.length + 1 }]);
    }
  };

  const updateAttackType = (id, type) => {
    setAttacks((prev) =>
      prev.map((attack) =>
        attack.id === id ? { ...attack, type, options: { ...attack.options, calledShot: false } } : attack
      )
    );

    setPenalties((prevPenalties) =>
      prevPenalties.filter((penalty) => !penalty.startsWith("Called Shot Penalty"))
    );
  };

  const updateAttackOption = (id, option, value) => {
    setAttacks((prev) =>
      prev.map((attack) =>
        attack.id === id
          ? { ...attack, options: { ...attack.options, [option]: value } }
          : attack
      )
    );

    if (option === "calledShot") {
      const totalCalledShots = attacks.filter(
        (attack) => attack.options && attack.options.calledShot
      ).length;

      if (value) {
        setPenalties((prevPenalties) => [
          ...prevPenalties,
          `Called Shot Penalty: -${(totalCalledShots + 1) * 2}`,
        ]);
      } else {
        setPenalties((prevPenalties) =>
          prevPenalties.filter((penalty) => !penalty.startsWith("Called Shot Penalty"))
        );

        const remainingCalledShots = totalCalledShots - 1;
        for (let i = 0; i < remainingCalledShots; i++) {
          setPenalties((prevPenalties) => [
            ...prevPenalties,
            `Called Shot Penalty: -${(i + 1) * 2}`,
          ]);
        }
      }
    }
  };

  const actionDetails = {
    aim: "Ignore up to -4 penalties or gain +2 to hit NEXT turn. You can take no other main action this turn.",
    defend: "Increase parry by +4 until your next turn. You can take no other main action this turn.",
    attack: "Choose to attack with Melee or Ranged. Further options will appear below.",
    shove: "Roll ATHLETICS to push your target (hopefully off a cliff)",
    grapple: "Roll ATHLETICS to snatch your target. Next turn you can CRUSH your target!",
    taunt: "Roll SMARTS or SPIRIT to throw off your opponent!",
    support: "Assist an ally with their action.",
    cast: "Cast a spell. Choose your spell and follow the rules below.",
  };

  const ordinalize = (n) => {
    const ordinals = ["First", "Second", "Third"];
    return ordinals[n - 1] || `${n}th`;
  };

  return (
    <div style={{ padding: "1rem", borderTop: "1px solid #ccc" }}>
      <h3 style={{ marginBottom: "0.5rem" }}>MAIN ACTIONS:</h3>

      {!selectedAction && (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          {Object.keys(actionDetails).map((action) => (
            <label key={action}>
              <input
                type="radio"
                name="mainAction"
                value={action}
                onChange={() => handleActionSelect(action)}
              />
              {action.charAt(0).toUpperCase() + action.slice(1)}
            </label>
          ))}
        </div>
      )}

      {selectedAction && selectedAction !== "attack" && selectedAction !== "cast" && (
        <div>
          <p>
            <strong>Selected Action:</strong>{" "}
            {selectedAction.charAt(0).toUpperCase() + selectedAction.slice(1)}
          </p>
          <p>{actionDetails[selectedAction]}</p>
          <button onClick={resetActions} style={{ marginTop: "1rem" }}>
            Reset Actions
          </button>
        </div>
      )}

      {selectedAction === "attack" && (
        <div style={{ marginTop: "1rem" }}>
          {attacks.map((attack) => (
            <div key={attack.id} style={{ marginBottom: "1rem" }}>
              <h4>{`${ordinalize(attack.id)} Attack`}</h4>
              <label style={{ display: "block", marginBottom: "0.5rem" }}>
                <input
                  type="radio"
                  name={`attackType-${attack.id}`}
                  value="melee"
                  onChange={() => updateAttackType(attack.id, "melee")}
                />
                🗡️ Melee
              </label>
              <label style={{ display: "block", marginBottom: "0.5rem" }}>
                <input
                  type="radio"
                  name={`attackType-${attack.id}`}
                  value="ranged"
                  onChange={() => updateAttackType(attack.id, "ranged")}
                />
                🏹 Ranged
              </label>
              {attack.type === "melee" && (
                <div style={{ marginLeft: "1rem" }}>
                  <p><b>SCORE TO BEAT:</b> <i>Your opponent's parry score</i></p>
                  <label style={{ display: "block" }}>
                    <input
                      type="checkbox"
                      onChange={(e) =>
                        updateAttackOption(attack.id, "wildSwing", e.target.checked)
                      }
                    />
                    😡Wild Attack <small>(+2 damage +2 to hit, but +2 to hit you!)</small>
                  </label>
                </div>
              )}
              {attack.type === "ranged" && (
                <div style={{ marginLeft: "1rem" }}>
                  <p><b>SCORE TO BEAT:</b> <i>4 + Cover Bonuses</i></p>
                </div>
              )}
              {(attack.type === "melee" || attack.type === "ranged") && (
                <div style={{ marginLeft: "1rem" }}>
                  <label>
                    <input
                      type="checkbox"
                      checked={attack.options.calledShot || false}
                      onChange={(e) =>
                        updateAttackOption(attack.id, "calledShot", e.target.checked)
                      }
                    />
                    🎯Called Shot <small>(-2 to hit, does special damage)</small>
                  </label>
                </div>
              )}
            </div>
          ))}
          {attacks.length < 3 && attacks.every((attack) => attack.type) && (
            <button onClick={addAttack} style={{ display: "block", marginBottom: "1rem" }}>
              Add another attack (-2 penalty to all rolls)
            </button>
          )}
          <button onClick={resetActions} style={{ display: "block" }}>
            Reset Actions
          </button>
        </div>
      )}

      {selectedAction === "cast" && (
  <div style={{ marginTop: "1rem" }}>
    {spells.map((spell) => (
      <div key={spell.id} style={{ marginBottom: "1rem" }}>
        <h4>{`${ordinalize(spell.id)} Spell`}</h4>
        <ul style={{ marginLeft: "2rem" }}>
          <li>Click your spell/power in Roll20 to display it.</li>
          <li>Roll your appropriate spellcasting skill <small>(Magic, Miracles, Weird Science, etc.)</small></li>
          <ul style={{ marginLeft: "2rem" }}>
            <li><b>4 or better = </b>Success!</li>
            <li><b>Less than 4 = </b>Failure!</li>
            <li><b>All 1s =</b> <i>BACKLASH!</i> Failure AND gain a level of fatigue!</li>
          </ul>
          <li>Maintaining a power from a previous turn? Pay 1 power point per target.</li>
        </ul>
      </div>
    ))}
    {spells.length < 3 && (
      <button onClick={addSpell} style={{ display: "block", marginBottom: "1rem" }}>
        Cast another spell (-2 penalty to all rolls)
      </button>
    )}
    <button onClick={resetActions} style={{ display: "block" }}>
      Reset Actions
    </button>
  </div>
)}

    </div>
  );
}
