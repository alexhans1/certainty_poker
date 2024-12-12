import React, { createContext, ReactNode, useContext, useState } from "react"
import { Game } from "../../../interfaces"

interface GameContextType {
  game?: Game
  setGame: React.Dispatch<React.SetStateAction<Game | undefined>>
}

// Create the context with a default value
const GameContext = createContext<GameContextType | undefined>(undefined)

// Create a provider component
const GameProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [game, setGame] = useState<Game | undefined>()

  return (
    <GameContext.Provider value={{ game, setGame }}>
      {children}
    </GameContext.Provider>
  )
}

export default GameProvider

// Custom hook for using the Game context
export const useGame = (): GameContextType => {
  const context = useContext(GameContext)
  if (!context) {
    throw new Error("useGame must be used within a GameProvider")
  }
  return context
}
