import React from "react";
import { MonetizationOn } from "@material-ui/icons";
import {
  QuestionRound,
  BettingRound,
  Player,
  QuestionTypes,
} from "../../../interfaces";
import ActionButtons, { ActionButtonsProps } from "../ActionButtons";
import {
  calculateBettingRoundSpendingForPlayer,
  hasPlayerFolded,
  haveAllPlayersPlacedTheirGuess,
} from "../helpers";
import FormattedGuess from "../Guess";
import Status from "../PokerTable/Player/Status";

import "./styles.css";

interface Props
  extends Omit<
    ActionButtonsProps,
    "currentQuestionRound" | "playerId" | "isAppPlayerTurn"
  > {
  player: Player;
  usedQuestionRound: QuestionRound;
  hasPlayerPlacedGuessInCurrentQuestionRound: boolean;
  setShowAnswerDrawer: React.Dispatch<React.SetStateAction<boolean>>;
  currentBettingRound?: BettingRound;
}

export default ({
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
    haveAllPlayersPlacedTheirGuess(usedQuestionRound, game.players);

  const appPlayerAnswer = usedQuestionRound.guesses.find(
    (guess) => guess.playerId === player.id
  );

  let appPlayerMoney = game.players.find((p) => p.id === player.id)?.money ?? 0;
  if (usedQuestionRound.isOver && player.id && currentBettingRound) {
    const bettingRoundSpending = calculateBettingRoundSpendingForPlayer(
      currentBettingRound,
      player.id
    );
    appPlayerMoney += bettingRoundSpending;
  }

  const questionType = usedQuestionRound.question.type;

  const { changeInMoney = 0 } =
    usedQuestionRound?.results?.find(
      ({ playerId }) => player.id === playerId
    ) || {};

  const allPlayersPlacedTheirGuess =
    usedQuestionRound &&
    game.players &&
    haveAllPlayersPlacedTheirGuess(usedQuestionRound, game.players);

  return (
    <footer className="fixed bottom-0 left-0 w-full h-44 bg-gray-200 px-4 pt-2 pb-6 flex flex-col justify-end z-1003">
      <div className="w-full flex flex-col items-center justify-center mx-auto max-w-xl">
        <div className="absolute left-10 top-0 flex flex-col items-center">
          <span
            className={`absolute top-0 left-0 h-20 w-20 -mt-10 rounded-full flex items-center justify-center text-4xl ${
              usedQuestionRound.isOver && changeInMoney > 0
                ? "bg-green-500"
                : "bg-gray-400"
            }`}
          >
            <Status
              {...{
                isQuestionRoundOver: usedQuestionRound.isOver,
                isDead: player.isDead,
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
          {questionType !== QuestionTypes.GEO && (
            <>
              <p className="text-xs mt-12">Your Answer</p>
              <span className="text-2xl">
                {appPlayerAnswer && (
                  <FormattedGuess
                    guess={appPlayerAnswer.guess}
                    questionType={questionType}
                  />
                )}
              </span>
            </>
          )}
        </div>
        <p className="text-xs">Available money</p>
        <div className="flex items-center mb-6 text-2xl">
          <MonetizationOn className="mx-1" fontSize="inherit" />
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
        {!hasPlayerPlacedGuessInCurrentQuestionRound &&
          game.questionRounds.length > 1 && (
            <button
              className="new-question-button bg-blue-500 rounded-lg font-bold text-white text-center px-4 py-3 transition duration-300 ease-in-out hover:bg-blue-600 mx-auto"
              onClick={() => {
                setShowAnswerDrawer(true);
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
    </footer>
  );
};
