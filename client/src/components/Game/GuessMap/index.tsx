import React from "react"
import { AiFillCheckCircle } from "react-icons/ai"
import { Game, Player, QuestionRound, QuestionTypes } from "../../../interfaces"
import {
  calculateBettingRoundSpendingForPlayer,
  getRevealAnswer,
  hasPlayerFolded,
} from "../helpers"
import Map, { MarkerType } from "../Map"

interface Props {
  playerId?: Player["id"]
  players: Game["players"]
  usedQuestionRound: QuestionRound
  isSpectator: boolean
  className?: string
}

export default React.memo(
  ({ usedQuestionRound, isSpectator, playerId, players, className }: Props) => {
    const questionType = usedQuestionRound.question.type
    if (!usedQuestionRound || questionType !== QuestionTypes.GEO) {
      return null
    }

    const playerGuess = [
      ...usedQuestionRound.guesses,
      ...usedQuestionRound.deadPlayerGuesses,
    ].find((g) => g.playerId === playerId)

    const mapMarkers: MarkerType[] = playerGuess?.guess.geo
      ? [
          {
            position: playerGuess.guess.geo,
            label: "You",
            distanceToAnswer: playerGuess.difference,
          },
        ]
      : []

    if (isSpectator || usedQuestionRound.isOver) {
      mapMarkers.push(
        ...[
          ...usedQuestionRound.guesses,
          ...usedQuestionRound.deadPlayerGuesses,
        ].reduce<MarkerType[]>((acc, { guess, playerId: pId, difference }) => {
          if (!guess.geo) return acc
          if (playerId === pId) return acc

          const moneyInQuestionRound = usedQuestionRound.bettingRounds.reduce(
            (sum, br) => sum + calculateBettingRoundSpendingForPlayer(br, pId),
            0,
          )
          const hasFolded = hasPlayerFolded(usedQuestionRound, pId)
          const isPartOfShowdown =
            usedQuestionRound.isOver &&
            usedQuestionRound.isShowdown &&
            !hasFolded &&
            moneyInQuestionRound > 0

          if (
            isSpectator ||
            isPartOfShowdown ||
            usedQuestionRound.revealedGuesses.includes(pId)
          ) {
            const label = players.find((p) => p.id === pId)?.name || ""
            acc.push({
              position: guess.geo,
              label,
              distanceToAnswer: difference,
            })
          }
          return acc
        }, []),
      )
    }
    if (
      getRevealAnswer(usedQuestionRound) &&
      usedQuestionRound.question.answer.geo
    ) {
      mapMarkers.push({
        position: usedQuestionRound.question.answer.geo,
        label: <AiFillCheckCircle className="text-green-500 text-2xl" />,
        isAnswer: true,
        radiusInKilometres:
          usedQuestionRound.question.answer.geo.toleranceRadius,
      })
    }

    return <Map className={className} markers={mapMarkers} />
  },
)
