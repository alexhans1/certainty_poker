import React from "react"
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
import DateInput from "./DateInput"
import MapInput from "./MapInput"
import MultipleChoiceInput from "./MultipleChoiceInput"
import NumberInput from "./NumberInput"

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
  if (!player || player.isDead) {
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

  const getInput = () => {
    switch (currentQuestionRound.question.type) {
      case QuestionTypes.NUMERICAL:
        return <NumberInput handleSubmit={handleNumberInputSubmit} />
      case QuestionTypes.DATE:
        return <DateInput handleSubmit={handleNumberInputSubmit} />
      case QuestionTypes.GEO:
        return <MapInput handleSubmit={handleMapInputSubmit} />
      case QuestionTypes.MULTIPLE_CHOICE: {
        const alternatives = currentQuestionRound.question.alternatives?.map(
          (alt) => ({ value: alt, active: true }),
        )
        return (
          <MultipleChoiceInput
            usedQuestionRound={currentQuestionRound}
            alternatives={alternatives}
            handleSubmit={handleNumberInputSubmit}
          />
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
        <p className="font-bold">{currentQuestionRound.question.question}</p>
        <p className="mt-4 text-sm">Your answer</p>
        {getInput()}
      </>
    </Drawer>
  )
}
