import { actionIcons } from "./Player/Status";
import { BettingRound, Game, Player } from "../../../interfaces";
import { calculateAmountToCall } from "../helpers";

export const getCurrentPlayerAction = (
  player: Player,
  bettingRoundSpending: number,
  currentBettingRound?: BettingRound
): keyof typeof actionIcons | undefined => {
  if (!currentBettingRound) {
    return undefined;
  }

  const playerHadAtLeastOneTurnInCurrentBettingRound = !!currentBettingRound.bets.find(
    (bet) => bet.playerId === player.id
  );
  if (!playerHadAtLeastOneTurnInCurrentBettingRound) {
    return "waiting";
  }

  const amountToCallForPlayer = calculateAmountToCall(
    currentBettingRound,
    player.id
  );
  const playerIsWaitingForAnotherTurn = amountToCallForPlayer > 0;
  if (playerIsWaitingForAnotherTurn) {
    return "waiting";
  }

  if (bettingRoundSpending === 0) {
    return "checked";
  }

  return "called";
};

export const getWinningPlayerArray = (game: Game) => {
  if (game.isOver) {
    return game.players
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
        [game.players[0]]
      )
      .map((p) => p.id);
  }
};
