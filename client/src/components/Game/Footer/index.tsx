import React from "react";
import { QuestionRound, Game, BettingRound, Player } from "../../../interfaces";
import ActionButtons, { ActionButtonsProps } from "../ActionButtons";
import {
  getCurrentBettingRound,
  haveAllPlayersPlacedTheirGuess,
} from "../helpers";
import Pot from "../Pot";
import StartGameButton from "./StartGameButton";

import "./styles.scss";

export type StartGame = ({
  variables: { gameId },
}: {
  variables: { gameId: Game["id"] };
}) => void;

interface FooterProps
  extends Omit<
    ActionButtonsProps,
    "currentQuestionRound" | "playerId" | "isAppPlayerTurn"
  > {
  startGame: StartGame;
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
  startGame,
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
        {!game.questionRounds.length && (
          <StartGameButton
            startGame={startGame}
            gameId={game.id}
            isDisabled={game.players.length <= 1}
          />
        )}
        {!hasPlayerPlacedGuessInCurrentQuestionRound &&
          game.questionRounds.length > 1 && (
            <button
              className="new-question-button btn btn-primary mx-auto"
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
