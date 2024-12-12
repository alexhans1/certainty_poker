import { lazy, Suspense, useEffect, useState } from "react"
import { AiFillFileUnknown } from "react-icons/ai"
import { useParams } from "react-router"
import { Game, Guess } from "../../interfaces.ts"
import { getPlayerIdFromStorage, setPlayerIdToStorage } from "../../storage.ts"
import ErrorFallback from "../ErrorBoundary.tsx"
import {
  getCurrentBettingRound,
  getCurrentQuestionRound,
  getPreviousQuestionRound,
  haveAllPlayersPlacedTheirGuess,
} from "./helpers/index.ts"
import LeaveGameButton from "./LeaveGameButton/index.tsx"
// @ts-ignore
import notificationSound from "../../assets/turn-notification.mp3"
// @ts-ignore
import alertSound from "../../assets/turn-alert.wav"

import { doc, onSnapshot } from "firebase/firestore"
import { withErrorBoundary } from "react-error-boundary"
import {
  placeBet as placeBetRequest,
  startGame as startGameRequest,
} from "../../api/index.ts"
import db, { addGuess, createPlayer } from "../../db/index.ts"
import GameProvider, { useGame } from "./Context/index.tsx"
import "./styles.css"

const PreGameLobby = lazy(() => import("./PreGameLobby/index.tsx"))
const PokerTable = lazy(() => import("./PokerTable/index.tsx"))
const AnswerDrawer = lazy(() => import("./AnswerDrawer/index.tsx"))
const Footer = lazy(() => import("./Footer/index.tsx"))

const vibrate = (t: number) => {
  window.navigator.vibrate && window.navigator.vibrate(t)
}
let soundInterval: NodeJS.Timeout

function GameComponent() {
  const { game, setGame } = useGame()
  const [loading, setLoading] = useState(true)
  const [playerId, setPlayerId] = useState<string | undefined>(undefined)
  const currentQuestionRound = getCurrentQuestionRound(game)
  const currentBettingRound = getCurrentBettingRound(currentQuestionRound)
  const [showAnswerDrawer, setShowAnswerDrawer] = useState(false)
  const [
    showNewQuestionRoundForSpectator,
    setShowNewQuestionRoundForSpectator,
  ] = useState(false)
  const { gameId } = useParams<{ gameId: string }>()
  if (!gameId) {
    throw new Error("gameId is required")
  }
  const [_, setError] = useState<Error>()

  const [playNotification] = useState(new Audio(notificationSound))
  const [playAlert] = useState(new Audio(alertSound))

  useEffect(() => {
    if (gameId) {
      const storedPlayerId = getPlayerIdFromStorage(gameId)

      if (storedPlayerId) {
        setPlayerId(storedPlayerId)
      }
    }
  }, [gameId])

  useEffect(() => {
    const unsubscribe = onSnapshot(
      doc(db, "games", gameId),
      (docSnapshot) => {
        if (docSnapshot.exists()) {
          clearInterval(soundInterval)
          const updatedGame = { ...docSnapshot.data(), id: gameId } as Game
          if (!updatedGame.players) updatedGame.players = []
          if (!updatedGame.questionRounds) updatedGame.questionRounds = []
          setGame(updatedGame)

          const cqr = getCurrentQuestionRound(updatedGame)
          const cbr = getCurrentBettingRound(cqr)
          const players = updatedGame.players
          const allPlayersGuessed =
            cqr && haveAllPlayersPlacedTheirGuess(cqr, players)
          if (allPlayersGuessed) {
            setShowNewQuestionRoundForSpectator(false)
          }

          if (
            !updatedGame?.isOver &&
            cbr?.currentPlayer.id === playerId &&
            allPlayersGuessed
          ) {
            playNotification.play()
            vibrate(200)
            soundInterval = setInterval(() => {
              playAlert.play()
              vibrate(200)
            }, 15000)
          }
        } else {
          console.log("Game does not exist.")
        }
        setLoading(false)
      },
      (error) => {
        errorHandler(error)
        setLoading(false)
      },
    )

    // Cleanup subscription on component unmount
    return () => {
      unsubscribe()
      clearInterval(soundInterval)
    }
  }, [gameId, playAlert, playNotification, playerId, setGame])

  const errorHandler = (err: Error) => {
    console.error("error", err)
    setError(() => {
      throw err
    })
  }

  const handleCreatePlayer = async (gameId: string, playerName: string) => {
    try {
      // Add the player to the players array
      await createPlayer(gameId, playerName, (playerId: string) => {
        setPlayerIdToStorage(gameId, playerId)
        setPlayerId(playerId)
      })
    } catch (error) {
      errorHandler(error as unknown as Error)
    }
  }

  const startGame = async () => {
    if (!game) throw new Error("Game not found")
    if (game.questionRounds.length) throw new Error("Game already started")
    if (game.players.length < 2) throw new Error("Not enough players")

    try {
      await startGameRequest({ gameId: game.id })
    } catch (error) {
      errorHandler(error as unknown as Error)
    }
  }

  const placeBet = async (amount: number) => {
    if (!game) throw new Error("Game not found")
    if (!player) throw new Error("Player not found")

    try {
      await placeBetRequest({ gameId: game.id, playerId: player.id, amount })
    } catch (error) {
      errorHandler(error as unknown as Error)
    }
  }

  const handleAddGuess = async (guess: Guess) => {
    if (!game) throw new Error("Game not found")
    if (!currentQuestionRound) throw new Error("No current question round")

    try {
      await addGuess(game.id, game.questionRounds, currentQuestionRound, guess)
    } catch (error) {
      errorHandler(error as unknown as Error)
    }
  }

  if (loading) {
    return <h3 className="text-lg mt-6 font-semibold">Loading...</h3>
  }

  if (!game) {
    return (
      <p className="text-lg mt-6 flex items-center font-semibold">
        <AiFillFileUnknown className="text-4xl mr-2" /> Game not found.
      </p>
    )
  }

  const player = game.players.find((p) => p.id === playerId)
  const playerGuessInCurrentQuestionRound = currentQuestionRound?.guesses.find(
    (guess) => guess.playerId === playerId,
  )
  const hasPlayerPlacedGuessInCurrentQuestionRound =
    !!playerGuessInCurrentQuestionRound
  const gameHasStarted = !!game.questionRounds.length
  const isSpectator = gameHasStarted && (!player || player.isDead)
  const previousQuestionRound = getPreviousQuestionRound(game)
  const showPreviousQuestionRoundResults =
    !!previousQuestionRound &&
    (game.isOver ||
      (!hasPlayerPlacedGuessInCurrentQuestionRound && !isSpectator) ||
      (isSpectator &&
        !!currentQuestionRound &&
        !showNewQuestionRoundForSpectator &&
        !haveAllPlayersPlacedTheirGuess(currentQuestionRound, game.players)))
  const usedQuestionRound = showPreviousQuestionRoundResults
    ? previousQuestionRound
    : currentQuestionRound
  const fallback = <div>Loading...</div>

  return (
    <div
      className={`p-2 flex flex-col md:justify-center ${
        isSpectator || !gameHasStarted
          ? "min-h-screen"
          : "min-h-screen-minus-52 mb-52"
      }`}
    >
      <div className="flex flex-col md:my-auto">
        {!gameHasStarted && (
          <Suspense fallback={fallback}>
            <PreGameLobby
              players={game.players}
              gameLink={window.location.href}
              startGame={startGame}
              gameId={game.id}
              createPlayer={handleCreatePlayer}
              playerId={playerId}
              setNames={game.setNames}
            />
          </Suspense>
        )}
        {gameHasStarted && usedQuestionRound && (
          <Suspense fallback={fallback}>
            <PokerTable
              {...{
                game,
                usedQuestionRound,
                currentBettingRound,
                playerId,
                isSpectator,
              }}
            />
          </Suspense>
        )}
        {isSpectator && usedQuestionRound?.isOver && !game.isOver && (
          <button
            className="bg-blue-500 rounded-lg font-bold text-white text-center px-4 py-3 transition duration-300 ease-in-out hover:bg-blue-600 mx-auto mt-5"
            onClick={() => {
              setShowNewQuestionRoundForSpectator(true)
            }}
          >
            Show Next Question
          </button>
        )}
      </div>
      {currentQuestionRound && playerId && (
        <Suspense fallback={fallback}>
          <AnswerDrawer
            {...{
              game,
              addGuess: handleAddGuess,
              currentQuestionRound,
              player,
              showAnswerDrawer,
              setShowAnswerDrawer,
              hasPlayerPlacedGuessInCurrentQuestionRound,
            }}
          />
        </Suspense>
      )}
      {!game.isOver && player && !isSpectator && usedQuestionRound && (
        <Suspense fallback={fallback}>
          <Footer
            {...{
              game,
              usedQuestionRound,
              placeBet,
              player,
              startGame,
              hasPlayerPlacedGuessInCurrentQuestionRound,
              setShowAnswerDrawer,
              currentBettingRound,
            }}
          />
        </Suspense>
      )}

      <LeaveGameButton {...{ gameId, playerId, gameHasStarted, setPlayerId }} />
    </div>
  )
}

const GameWithContext = () => {
  return (
    <GameProvider>
      <GameComponent />
    </GameProvider>
  )
}

export default withErrorBoundary(GameWithContext, {
  onError: (error) => {
    console.error("Uncaught error:", error)
  },
  FallbackComponent: ErrorFallback,
})
