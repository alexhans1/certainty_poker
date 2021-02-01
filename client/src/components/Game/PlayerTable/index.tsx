import React from "react";
import FormattedGuess from "../Guess";
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
  QuestionTypes,
} from "../../../interfaces";
import PlayerRow from "./PlayerRow";

import "./styles.css";
import colors, { GradientColor } from "./colors";

interface ExtendedPlayer extends Player {
  rank?: number;
  gradientColor?: GradientColor;
}

export interface PlayerTableProps {
  players: ExtendedPlayer[];
  playerId?: Player["id"];
  currentBettingRound?: BettingRound;
  usedQuestionRound?: QuestionRound;
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
  game,
  isSpectator,
}: PlayerTableProps) => {
  if (!players.length) {
    return null;
  }
  players.forEach((p, i) => (p.gradientColor = colors[i % colors.length]));
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
  const questionType = usedQuestionRound?.question.type;

  return (
    <div className="table-container">
      {players.map(({ id, money, name, rank, isDead, gradientColor }, i) => {
        if (!gradientColor) {
          return null;
        }
        const hasFolded =
          usedQuestionRound && hasPlayerFolded(usedQuestionRound, id);
        const moneyDiff = usedQuestionRound?.results?.find(
          ({ playerId }) => id === playerId
        )?.changeInMoney;
        const bettingRoundSpending = currentBettingRound
          ? calculateBettingRoundSpendingForPlayer(currentBettingRound, id) * -1
          : 0;
        const revealGuess =
          isSpectator ||
          (!!usedQuestionRound?.isOver &&
            usedQuestionRound?.isShowdown &&
            !hasFolded);
        const guess = (revealGuess || id === playerId) &&
          guesses &&
          guesses[id] &&
          questionType && (
            <FormattedGuess
              {...{
                guess: guesses[id],
                questionType,
                alternatives: usedQuestionRound?.question.alternatives,
              }}
            />
          );
        return (
          <PlayerRow
            {...{
              key: id,
              id,
              name,
              currentPlayerId: currentBettingRound?.currentPlayer.id,
              isDead,
              isFolded: hasFolded,
              gameIsOver: game.isOver,
              questionRoundIsOver: usedQuestionRound?.isOver,
              isDealer: game?.dealerId === id,
              showPreviousQuestionRoundResults: !!usedQuestionRound?.isOver,
              isAppPlayer: id === playerId,
              money:
                money +
                (usedQuestionRound?.isOver && !game.isOver
                  ? bettingRoundSpending
                  : 0),
              moneyChange: usedQuestionRound?.isOver
                ? moneyDiff
                : bettingRoundSpending,
              guess:
                questionType !== QuestionTypes.GEO &&
                !isDead &&
                (guess || (
                  <span className={id === playerId ? "" : "obfuscate"}>
                    {guesses && !guesses[id] && guesses[id] !== 0 ? null : 432}
                  </span>
                )),
              hasWonGame: winningPlayerIds?.includes(id),
              rank,
              gradientColor,
            }}
          />
        );
      })}
    </div>
  );
};
