import React from "react"
import { FaSkullCrossbones } from "react-icons/fa"
import {
  Answer,
  Game,
  GeoCoordinate,
  Guess,
  Player,
  QuestionRound,
  QuestionTypes,
} from "../../../interfaces"
import Drawer from "../../shared/Drawer"

const NumberInput = React.lazy(() => import("./NumberInput"))
const DateInput = React.lazy(() => import("./DateInput"))
const MapInput = React.lazy(() => import("./MapInput"))
const MultipleChoiceInput = React.lazy(() => import("./MultipleChoiceInput"))

interface QuestionProps {
  game: Game
  currentQuestionRound: QuestionRound
  player?: Player
  addGuess: (guess: Guess) => Promise<void>
  showAnswerDrawer: boolean
  setShowAnswerDrawer: React.Dispatch<React.SetStateAction<boolean>>
  hasPlayerPlacedGuessInCurrentQuestionRound: boolean
}

export default function AnswerDrawer({
  currentQuestionRound,
  player,
  addGuess,
  game,
  showAnswerDrawer,
  setShowAnswerDrawer,
  hasPlayerPlacedGuessInCurrentQuestionRound,
}: QuestionProps) {
  if (!player) {
    return null
  }

  const handleNumberInputSubmit = (guess: number | string) => {
    if ((guess || guess === 0) && typeof guess === "number") {
      addGuess({
        playerId: player.id,
        guess: {
          numerical: guess,
        },
      })
      setShowAnswerDrawer(false)
    }
  }

  const handleMapInputSubmit = (geoCoordinate: GeoCoordinate) => {
    const guess: Answer = {
      geo: geoCoordinate,
    }
    addGuess({
      playerId: player.id,
      guess,
    })
    setShowAnswerDrawer(false)
  }

  const fallback = <div>Loading...</div>

  const getInput = () => {
    switch (currentQuestionRound.question.type) {
      case QuestionTypes.NUMERICAL:
        return (
          <React.Suspense fallback={fallback}>
            <NumberInput handleSubmit={handleNumberInputSubmit} />
          </React.Suspense>
        )
      case QuestionTypes.DATE:
        return (
          <React.Suspense fallback={fallback}>
            <DateInput handleSubmit={handleNumberInputSubmit} />
          </React.Suspense>
        )
      case QuestionTypes.GEO:
        return (
          <React.Suspense fallback={fallback}>
            <MapInput handleSubmit={handleMapInputSubmit} />
          </React.Suspense>
        )
      case QuestionTypes.MULTIPLE_CHOICE: {
        const alternatives = currentQuestionRound.question.alternatives?.map(
          (alt) => ({ value: alt, active: true }),
        )
        return (
          <React.Suspense fallback={fallback}>
            <MultipleChoiceInput
              usedQuestionRound={currentQuestionRound}
              alternatives={alternatives}
              handleSubmit={handleNumberInputSubmit}
            />
          </React.Suspense>
        )
      }
      default:
        throw new Error("Unknown Question Type")
    }
  }

  return (
    <Drawer
      onClose={() => {
        setShowAnswerDrawer(false)
      }}
      anchor={"bottom"}
      open={
        (showAnswerDrawer || game.questionRounds.length === 1) &&
        !hasPlayerPlacedGuessInCurrentQuestionRound
      }
      variant="temporary"
    >
      <>
        {player.isDead && (
          <div
            className="p-4 text-sm text-gray-800 rounded-lg bg-gray-50 mb-3"
            role="alert"
          >
            <p className="flex">
              You are dead. <FaSkullCrossbones className="ml-2" />
            </p>
            <p>
              Tough luck. But you can keep answering questions just for fun. You
              can choose to reveal your guess after the round ends.
            </p>
          </div>
        )}
        <p className="font-bold">{currentQuestionRound.question.question}</p>
        <p className="mt-4 text-sm">Your answer</p>
        {getInput()}
      </>
    </Drawer>
  )
}
