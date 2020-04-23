import { QuestionRound, Player } from "../../interfaces";

export const calculatePotSpendingForPlayer = (
  questionRound: QuestionRound,
  playerId: Player["id"]
) =>
  questionRound.bettingRounds.reduce((sumInPot, bettingRound, i) => {
    if (i > questionRound.currentBettingRound) {
      return sumInPot;
    }
    return (
      sumInPot +
      (bettingRound?.bets?.find((bet) => bet.playerId === playerId)?.amount ??
        0)
    );
  }, 0);
