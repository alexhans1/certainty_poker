import React from "react"
import { CountdownCircleTimer } from "react-countdown-circle-timer"
import { GrMoney } from "react-icons/gr"
import {
  BettingRound,
  Player,
  QuestionRound,
  QuestionTypes,
} from "../../../interfaces"
import FormattedGuess from "../Guess"
import {
  calculateBettingRoundSpendingForPlayer,
  hasPlayerFolded,
  haveAllPlayersPlacedTheirGuess,
} from "../helpers"
import Status from "../PokerTable/Player/Status"
import ActionButtons, { ActionButtonsProps } from "./ActionButtons"

interface Props
  extends Omit<
    ActionButtonsProps,
    "currentQuestionRound" | "playerId" | "isAppPlayerTurn"
  > {
  player: Player
  usedQuestionRound: QuestionRound
  hasPlayerPlacedGuessInCurrentQuestionRound: boolean
  setShowAnswerDrawer: React.Dispatch<React.SetStateAction<boolean>>
  currentBettingRound?: BettingRound
}

const Footer = ({
  game,
  usedQuestionRound,
  player,
  placeBet,
  hasPlayerPlacedGuessInCurrentQuestionRound,
  setShowAnswerDrawer,
  currentBettingRound,
}: Props) => {
  const isAppPlayerTurn =
    currentBettingRound?.currentPlayer.id === player.id &&
    haveAllPlayersPlacedTheirGuess(usedQuestionRound, game.players)

  const appPlayerAnswer = usedQuestionRound.guesses.find(
    (guess) => guess.playerId === player.id,
  )

  let appPlayerMoney = game.players.find((p) => p.id === player.id)?.money ?? 0
  const bettingRoundSpending =
    (currentBettingRound &&
      calculateBettingRoundSpendingForPlayer(currentBettingRound, player.id)) ||
    0
  if (usedQuestionRound.isOver && player.id && currentBettingRound) {
    appPlayerMoney += bettingRoundSpending
  }

  const questionType = usedQuestionRound.question.type

  const { changeInMoney = 0 } =
    usedQuestionRound?.results?.find(
      ({ playerId }) => player.id === playerId,
    ) || {}

  const allPlayersPlacedTheirGuess =
    usedQuestionRound &&
    game.players &&
    haveAllPlayersPlacedTheirGuess(usedQuestionRound, game.players)

  return (
    <footer className="fixed shadow-top-md bottom-0 left-0 w-full h-44 bg-gray-200 px-4 flex flex-col items-center justify-end z-1003">
      <div className="w-full flex flex-col items-end md:items-center justify-center max-w-xl my-auto">
        <div className="absolute left-4 md:left-10 top-0 flex flex-col items-center max-w-2xs text-center">
          <span
            className={`absolute shadow-top-md top-0 h-20 w-20 -mt-10 rounded-full flex items-center justify-center text-4xl ${
              usedQuestionRound.isOver && changeInMoney > 0
                ? "bg-green-500"
                : "bg-gray-400"
            } ${
              usedQuestionRound.question.type === QuestionTypes.GEO
                ? "left-0"
                : ""
            }`}
          >
            {isAppPlayerTurn && !usedQuestionRound.isOver && (
              <span className="absolute">
                <CountdownCircleTimer
                  isPlaying={isAppPlayerTurn}
                  size={80}
                  strokeWidth={5}
                  duration={15}
                  colors={"#00477780"}
                  trailColor="#9ca3af"
                />
              </span>
            )}
            <span>
              <Status
                {...{
                  player,
                  isQuestionRoundOver: usedQuestionRound.isOver,
                  isTurnPlayer:
                    !usedQuestionRound.isOver &&
                    player.id === currentBettingRound?.currentPlayer.id,
                  hasFolded: !!(
                    usedQuestionRound &&
                    hasPlayerFolded(usedQuestionRound, player.id)
                  ),
                  changeInMoney,
                  allPlayersPlacedTheirGuess,
                  playerHasPlacedTheirGuess: !!appPlayerAnswer,
                }}
              />
            </span>
          </span>
          {questionType !== QuestionTypes.GEO && (
            <>
              <p className="text-xs mt-12">Your Answer</p>
              <span className="text-2xl overflow-hidden max-h-24">
                {appPlayerAnswer && (
                  <FormattedGuess
                    guess={appPlayerAnswer.guess}
                    questionType={questionType}
                    alternatives={usedQuestionRound.question.alternatives}
                  />
                )}
              </span>
            </>
          )}
        </div>
        <div
          className={`flex items-center ${
            usedQuestionRound.isOver ? "flex-col" : "md:flex-col"
          }`}
        >
          <div className="flex flex-col items-center mr-3 sm:mr-5 md:mr-0">
            <p className="text-xs">Available money</p>
            <div className="flex items-center mb-6 text-2xl">
              <GrMoney className="mx-1" />
              <span>{appPlayerMoney}</span>
              {changeInMoney !== 0 && (
                <span
                  className={`ml-2 ${
                    changeInMoney > 0 ? "text-green-500" : "text-red-500"
                  }`}
                >
                  ({changeInMoney > 0 ? "+" : ""}
                  {changeInMoney})
                </span>
              )}
            </div>
          </div>
          {!hasPlayerPlacedGuessInCurrentQuestionRound &&
            game.questionRounds.length > 1 && (
              <button
                className="new-question-button bg-blue-500 rounded-lg font-bold text-white text-center px-3 py-2 md:px-4 md:py-3 text-xs md:text-base transition duration-300 ease-in-out hover:bg-blue-600 mx-auto"
                onClick={() => {
                  setShowAnswerDrawer(true)
                }}
              >
                Answer New Question
              </button>
            )}
          {hasPlayerPlacedGuessInCurrentQuestionRound && player.id && (
            <ActionButtons
              {...{
                game,
                usedQuestionRound,
                currentBettingRound,
                placeBet,
                playerId: player.id,
                isAppPlayerTurn,
              }}
            />
          )}
        </div>
      </div>
    </footer>
  )
}

export default Footer
