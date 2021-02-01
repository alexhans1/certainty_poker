import React from "react";
import { QuestionRound, Game, BettingRound, Player } from "../../../interfaces";
import ActionButtons, { ActionButtonsProps } from "../ActionButtons";
import {
  getCurrentBettingRound,
  haveAllPlayersPlacedTheirGuess,
} from "../helpers";
import Pot from "../Pot";
import StartGameButton from "./StartGameButton";

import "./styles.css";

interface FooterProps
  extends Omit<
    ActionButtonsProps,
    "currentQuestionRound" | "playerId" | "isAppPlayerTurn"
  > {
  playerId?: Player["id"];
  usedQuestionRound: QuestionRound;
  hasPlayerPlacedGuessInCurrentQuestionRound: boolean;
  setShowAnswerDrawer: React.Dispatch<React.SetStateAction<boolean>>;
}

export default ({
  game,
  usedQuestionRound,
  playerId,
  placeBet,
  hasPlayerPlacedGuessInCurrentQuestionRound,
  setShowAnswerDrawer,
}: FooterProps) => {
  const revealPreviousAnswers =
    game?.isOver ||
    (game &&
      game.questionRounds.length > 1 &&
      !usedQuestionRound?.guesses.find((guess) => guess.playerId === playerId));

  const currentBettingRound = getCurrentBettingRound(usedQuestionRound);

  const isAppPlayerTurn =
    currentBettingRound?.currentPlayer.id === playerId &&
    haveAllPlayersPlacedTheirGuess(usedQuestionRound, game.players);

  return (
    <div className="footer">
      <div className="footer-content">
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
        {hasPlayerPlacedGuessInCurrentQuestionRound && playerId && (
          <>
            {/* <Pot
                playerId={playerId}
                currentQuestionRound={currentQuestionRound}
                currentBettingRound={currentBettingRound}
                revealPreviousAnswers={revealPreviousAnswers}
              /> */}
            <ActionButtons
              {...{
                game,
                usedQuestionRound,
                currentBettingRound,
                placeBet,
                playerId,
                isAppPlayerTurn,
              }}
            />
          </>
        )}
      </div>
    </div>
  );
};
