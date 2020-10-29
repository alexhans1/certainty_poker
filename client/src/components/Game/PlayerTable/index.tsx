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

export interface PlayerTableProps {
  players?: Player[];
  playerId?: Player["id"];
  currentBettingRound?: BettingRound;
  currentQuestionRound?: QuestionRound;
  game?: Game;
  isResultList?: boolean;
}

const moveAppPlayerToTop = (players: Player[], playerId: Player["id"]) => {
  const players_ = [...players];
  const a = players_.splice(
    players_.findIndex(({ id }) => id === playerId),
    players_.length
  );
  return [...a, ...players_];
};

export default ({
  players,
  playerId,
  currentBettingRound,
  currentQuestionRound,
  game,
  isResultList,
}: PlayerTableProps) => {
  if (!players?.length || !playerId) {
    return null;
  }
  if (isResultList) {
    players = players.sort((p1, p2) => p2.money - p1.money);
  } else {
    players = moveAppPlayerToTop(players, playerId);
  }

  const revealPreviousAnswers =
    game?.isOver ||
    (game &&
      game.questionRounds.length > 1 &&
      !currentQuestionRound?.guesses.find(
        (guess) => guess.playerId === playerId
      ));

  let previousQuestionRoundGuesses: { [key: string]: Guess["guess"] };
  if (game && revealPreviousAnswers) {
    previousQuestionRoundGuesses = game.questionRounds[
      game.questionRounds.length - (game.isOver ? 1 : 2)
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
      {(players || []).map(({ id, money, name }, i) => {
        const isDead =
          currentQuestionRound &&
          isPlayerDead(currentQuestionRound, { id, money });
        const isFolded =
          currentQuestionRound && hasFolded(currentQuestionRound, id);
        return (
          <div key={id} className="d-flex align-items-center pt-4 ml-4">
            <div
              className={`avatar ${i === 0 ? "lg" : "md"} ${
                (isDead || isFolded) && !isResultList ? "dead" : ""
              }`}
            >
              <span>{name}</span>
              {!isResultList &&
                currentBettingRound?.currentPlayer.id === id && (
                  <span className="turn">{">"}</span>
                )}
              {isResultList && i === 0 && (
                <span className="turn trophy" role="img" aria-label="trophy">
                  🏆
                </span>
              )}
            </div>
            <div>
              <div
                className={`money ${id === playerId ? "" : "md"} ${
                  (isDead || isFolded) && !isResultList ? "dead" : ""
                }`}
              >
                {!isResultList &&
                  (revealPreviousAnswers ? (
                    <span>{previousQuestionRoundGuesses[id]}</span>
                  ) : (
                    id === playerId && <span>{playerGuess}</span>
                  ))}
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
