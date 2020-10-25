import React from "react";
import { isPlayerDead, hasFolded } from "../helpers";
import {
  Player,
  BettingRound,
  QuestionRound,
  Game,
  Guess,
} from "../../../interfaces";

import "./styles.scss";

interface PlayerTableProps {
  players?: Player[];
  playerId?: Player["id"];
  currentBettingRound?: BettingRound;
  currentQuestionRound?: QuestionRound;
  game?: Game;
}

const moveAppPlayerToTop = (players: Player[], playerId: Player["id"]) =>
  players.splice(
    0,
    0,
    players.splice(
      players.findIndex(({ id }) => id === playerId),
      1
    )[0]
  );

export default ({
  players,
  playerId,
  currentBettingRound,
  currentQuestionRound,
  game,
}: PlayerTableProps) => {
  if (!players?.length || !playerId) {
    return null;
  }
  moveAppPlayerToTop(players, playerId);

  const revealPreviousAnswers =
    game &&
    game.questionRounds.length > 1 &&
    !currentQuestionRound?.guesses.find((guess) => guess.playerId === playerId);

  let previousQuestionRoundGuesses: { [key: string]: Guess["guess"] };
  if (game && revealPreviousAnswers) {
    previousQuestionRoundGuesses = game.questionRounds[
      game.questionRounds.length - 2
    ].guesses.reduce(
      (acc, guess) => ({ ...acc, [guess.playerId]: guess.guess }),
      {}
    );
  }

  const playerGuess = currentQuestionRound?.guesses.find(
    (g) => g.playerId === playerId
  )?.guess;
  return (
    <div>
      {(players || []).map(({ id, money, name }) => {
        const isDead =
          currentQuestionRound &&
          isPlayerDead(currentQuestionRound, { id, money });
        const isFolded =
          currentQuestionRound && hasFolded(currentQuestionRound, id);
        return (
          <div key={id} className="d-flex align-items-center pt-4 ml-4">
            <div
              className={`avatar ${id === playerId ? "lg" : "md"} ${
                isDead || isFolded ? "dead" : ""
              }`}
            >
              <span>{name}</span>
              {currentBettingRound?.currentPlayer.id === id && (
                <span className="dice" role="img" aria-label="dice">
                  🎲
                </span>
              )}
            </div>
            <div>
              <div
                className={`money ${id === playerId ? "" : "md"} ${
                  isDead || isFolded ? "dead" : ""
                }`}
              >
                {revealPreviousAnswers ? (
                  <span>{previousQuestionRoundGuesses[id]}</span>
                ) : (
                  id === playerId && <span>{playerGuess}</span>
                )}
                <span role="img" aria-label="money">
                  💰{money}
                </span>
              </div>
            </div>
            {isDead && (
              <span className="skull" role="img" aria-label="skull">
                💀
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
};
