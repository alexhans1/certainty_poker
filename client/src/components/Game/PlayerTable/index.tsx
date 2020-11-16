import React from "react";
import {
  hasPlayerFolded,
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
  players: PlayerWithRank[];
  playerId?: Player["id"];
  currentBettingRound?: BettingRound;
  usedQuestionRound?: QuestionRound;
  showPreviousQuestionRoundResults: boolean;
  game: Game;
  isSpectator: boolean;
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
  usedQuestionRound,
  showPreviousQuestionRoundResults,
  game,
  isSpectator,
}: PlayerTableProps) => {
  if (!players.length) {
    return null;
  }
  if (game.isOver) {
    // todo: check if this changes the order of the player list after the game is over
    players
      .sort((p1, p2) => p2.money - p1.money)
      .forEach((player, i) => {
        player.rank = i + 1;
      });
  }
  if (playerId) {
    players = moveAppPlayerToTop(players, playerId);
  }

  let guesses: { [key: string]: Guess["guess"] };
  if (usedQuestionRound) {
    guesses = usedQuestionRound?.guesses.reduce(
      (acc, guess) => ({ ...acc, [guess.playerId]: guess.guess }),
      {}
    );
  }
  let winningPlayerIds: Player["id"][];
  if (game.isOver) {
    winningPlayerIds = players
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
  }

  return (
    <>
      {players.map(({ id, money, name, rank, isDead }, i) => {
        const hasFolded =
          usedQuestionRound && hasPlayerFolded(usedQuestionRound, id);
        const moneyDiff = usedQuestionRound?.results?.find(
          ({ playerId }) => id === playerId
        )?.changeInMoney;
        const bettingRoundSpending = currentBettingRound
          ? calculateBettingRoundSpendingForPlayer(currentBettingRound, id)
          : 0;

        return (
          <div key={id} className="d-flex align-items-center pt-4 ml-4">
            {game.isOver && <span className="rank">{rank}.</span>}
            <Avatar
              {...{
                id,
                name,
                currentBettingRound,
                isDead,
                isFolded: hasFolded,
                gameIsOver: game.isOver,
                isDealer: game?.dealerId === id,
                size: i === 0 && playerId ? Size.lg : Size.md,
              }}
            />
            <div
              className={`money ${id === playerId ? "" : "md"} ${
                (isDead || hasFolded) && !usedQuestionRound?.isOver
                  ? "dead"
                  : ""
              }`}
            >
              {showPreviousQuestionRoundResults || isSpectator ? (
                <span role="img" aria-label="answer">
                  💡 {guesses[id]}
                </span>
              ) : (
                guesses && (
                  <span role="img" aria-label="answer">
                    💡{" "}
                    <span className={id === playerId ? "" : "obfuscate"}>
                      {!guesses[id] && guesses[id] !== 0
                        ? null
                        : id === playerId
                        ? guesses[id]
                        : 432}
                    </span>
                  </span>
                )
              )}
              <div className="d-flex">
                <span role="img" aria-label="money">
                  💰
                  {money +
                    (showPreviousQuestionRoundResults && !game.isOver
                      ? bettingRoundSpending
                      : 0)}
                </span>
                {!showPreviousQuestionRoundResults &&
                  !!bettingRoundSpending && (
                    <span className="ml-4">{bettingRoundSpending * -1}</span>
                  )}
                {showPreviousQuestionRoundResults && moneyDiff && (
                  <span
                    className={`ml-2 ${
                      moneyDiff > 0 ? "text-success" : "text-danger"
                    }`}
                  >
                    {moneyDiff}
                  </span>
                )}
              </div>
            </div>
            {winningPlayerIds?.includes(id) && (
              <span className="trophy" role="img" aria-label="trophy">
                🏆
              </span>
            )}
            {isDead && !game.isOver && (
              <span className="skull" role="img" aria-label="skull">
                💀
              </span>
            )}
          </div>
        );
      })}
    </>
  );
};
