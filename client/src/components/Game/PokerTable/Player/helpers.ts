import { actionIcons } from "./Status";
import { BettingRound, Player } from "../../../../interfaces";
import { calculateAmountToCall } from "../../helpers";

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

  const playerIsAllIn = !player.isDead && player.money === 0;
  const amountToCallForPlayer = calculateAmountToCall(
    currentBettingRound,
    player.id
  );
  const playerIsWaitingForAnotherTurn =
    !playerIsAllIn && amountToCallForPlayer > 0;
  if (playerIsWaitingForAnotherTurn) {
    return "waiting";
  }

  if (bettingRoundSpending === 0) {
    return "checked";
  }

  return "called";
};
