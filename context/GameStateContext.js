import { createContext, useContext, useState } from "react";

const GameStateContext = createContext();

export function GameStateProvider({ children }) {
  const [penalties, setPenalties] = useState([]);
  const [actions, setActions] = useState({
    freeActionUsed: false,
    mainActionUsed: false,
  });

  return (
    <GameStateContext.Provider value={{ penalties, setPenalties, actions, setActions }}>
      {children}
    </GameStateContext.Provider>
  );
}

export function useGameState() {
  return useContext(GameStateContext);
}

