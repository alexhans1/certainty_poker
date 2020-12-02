import React from "react";
import { QuestionRound, Game, BettingRound, Player } from "../../../interfaces";
import ActionButtons, { ActionButtonsProps } from "../ActionButtons";
import Pot from "../Pot";

import "./styles.scss";

type StartGame = ({
  variables: { gameId },
}: {
  variables: { gameId: Game["id"] };
}) => void;

interface FooterProps
  extends Omit<ActionButtonsProps, "currentQuestionRound" | "playerId"> {
  startGame: StartGame;
  playerId?: Player["id"];
  currentQuestionRound?: QuestionRound;
  currentBettingRound?: BettingRound;
  showNewQuestionRound: boolean;
  setShowNewQuestionRound: React.Dispatch<React.SetStateAction<boolean>>;
}

export default ({
  game,
  currentQuestionRound,
  currentBettingRound,
  playerId,
  placeBet,
  startGame,
  showNewQuestionRound,
  setShowNewQuestionRound,
}: FooterProps) => {
  const revealPreviousAnswers =
    game?.isOver ||
    (game &&
      game.questionRounds.length > 1 &&
      !currentQuestionRound?.guesses.find(
        (guess) => guess.playerId === playerId
      ));

  const playerGuessInCurrentQuestionRound = currentQuestionRound?.guesses.find(
    (guess) => guess.playerId === playerId
  );
  const hasPlayerPlacedGuessInCurrentQuestionRound = !!playerGuessInCurrentQuestionRound;

  return (
    <div className="footer">
      <div className="footer-content">
        {!game.questionRounds.length && (
          <button
            className="btn btn-lg btn-primary mt-auto mx-5"
            disabled={game.players.length <= 1}
            onClick={() => {
              startGame({
                variables: { gameId: game.id },
              });
            }}
          >
            Start Game
          </button>
        )}
        {!showNewQuestionRound && !hasPlayerPlacedGuessInCurrentQuestionRound && (
          <button
            className="new-question-button btn btn-primary mx-auto"
            onClick={() => {
              setShowNewQuestionRound(true);
            }}
          >
            Answer New Question
          </button>
        )}
        {!(
          !showNewQuestionRound && !hasPlayerPlacedGuessInCurrentQuestionRound
        ) &&
          currentQuestionRound &&
          currentBettingRound &&
          playerId && (
            <>
              <Pot
                playerId={playerId}
                currentQuestionRound={currentQuestionRound}
                currentBettingRound={currentBettingRound}
                revealPreviousAnswers={revealPreviousAnswers}
              />
              <ActionButtons
                {...{
                  game,
                  currentQuestionRound,
                  currentBettingRound,
                  placeBet,
                  playerId,
                }}
              />
            </>
          )}
      </div>
    </div>
  );
};
