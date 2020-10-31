import React from "react";
import {
  isPlayerDead,
  hasFolded,
  calculateBettingRoundSpendingForPlayer,
} from "../helpers";
import {
  Player,
  BettingRound,
  QuestionRound,
  Game,
  Guess,
} from "../../../interfaces";
import Avatar, { Size } from "./Avatar";

import "./styles.scss";

interface PlayerWithRank extends Player {
  rank?: number;
}

export interface PlayerTableProps {
  players?: PlayerWithRank[];
  playerId?: Player["id"];
  currentBettingRound?: BettingRound;
  currentQuestionRound?: QuestionRound;
  game?: Game;
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
}: PlayerTableProps) => {
  if (!players?.length || !playerId) {
    return null;
  }
  const { isOver: gameIsOver } = game || {};
  if (gameIsOver) {
    players
      .sort((p1, p2) => p2.money - p1.money)
      .forEach((player, i) => {
        player.rank = i + 1;
      });
  }
  players = moveAppPlayerToTop(players, playerId);
  const revealPreviousAnswers =
    game?.isOver ||
    (game &&
      game.questionRounds.length > 1 &&
      !currentQuestionRound?.guesses.find(
        (guess) => guess.playerId === playerId
      ));

  let questionRoundGuesses: { [key: string]: Guess["guess"] };
  let previousQuestionRoundGuesses: { [key: string]: Guess["guess"] };
  if (game && revealPreviousAnswers) {
    previousQuestionRoundGuesses = game.questionRounds[
      game.questionRounds.length - (game.isOver ? 1 : 2)
    ].guesses.reduce(
      (acc, guess) => ({ ...acc, [guess.playerId]: guess.guess }),
      {}
    );
  }
  if (currentQuestionRound) {
    questionRoundGuesses = currentQuestionRound.guesses.reduce(
      (acc, guess) => ({ ...acc, [guess.playerId]: guess.guess }),
      {}
    );
  }
  const winningPlayerIds = players
    .reduce(
      (winners, player, i) => {
        if (i === 0) return winners;
        if (winners[0].money < player.money) {
          return [player];
        }
        if (winners[0].money === player.money) {
          return [...winners, player];
        }
        return winners;
      },
      [players[0]]
    )
    .map((p) => p.id);

  return (
    <div>
      {(players || []).map(({ id, money, name, rank }, i) => {
        const isDead =
          currentQuestionRound &&
          isPlayerDead(currentQuestionRound, { id, money });
        const isFolded =
          currentQuestionRound && hasFolded(currentQuestionRound, id);
        return (
          <div key={id} className="d-flex align-items-center pt-4 ml-4">
            {gameIsOver && <span className="rank">{rank}.</span>}
            <Avatar
              {...{
                id,
                name,
                currentBettingRound,
                isDead,
                isFolded,
                gameIsOver,
                isDealer: game?.dealerId === id,
                size: i === 0 ? Size.lg : Size.md,
              }}
            />
            <div
              className={`money ${id === playerId ? "" : "md"} ${
                (isDead || isFolded) && !gameIsOver ? "dead" : ""
              }`}
            >
              {revealPreviousAnswers &&
              (previousQuestionRoundGuesses[id] ||
                previousQuestionRoundGuesses[id] === 0) ? (
                <span role="img" aria-label="answer">
                  📣 {previousQuestionRoundGuesses[id]}
                </span>
              ) : (
                currentQuestionRound && (
                  <span role="img" aria-label="answer">
                    📣{" "}
                    <span className={id === playerId ? "" : "obfuscate"}>
                      {!questionRoundGuesses[id] &&
                      questionRoundGuesses[id] !== 0
                        ? null
                        : id === playerId
                        ? questionRoundGuesses[id]
                        : 432}
                    </span>
                  </span>
                )
              )}
              <span role="img" aria-label="money">
                💰
                {money +
                  (revealPreviousAnswers && currentBettingRound
                    ? calculateBettingRoundSpendingForPlayer(
                        currentBettingRound,
                        id
                      )
                    : 0)}
              </span>
            </div>
            {gameIsOver && winningPlayerIds.includes(id) && (
              <span className="trophy" role="img" aria-label="trophy">
                🏆
              </span>
            )}
            {isDead && !gameIsOver && (
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
