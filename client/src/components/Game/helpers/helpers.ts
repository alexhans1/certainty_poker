import { QuestionRound, Player, Game, BettingRound } from "../../../interfaces";

export const calculateBettingRoundSpendingForPlayer = (
  bettingRound: BettingRound,
  playerId: Player["id"]
) => {
  return bettingRound.bets.reduce(
    (sum, bet) => sum + (bet.playerId === playerId ? bet.amount : 0),
    0
  );
};

const calculateQuestionRoundSpendingForPlayer = (
  playerId: Player["id"],
  questionRound?: QuestionRound
) => {
  return questionRound?.bettingRounds.reduce(
    (sum, br) => sum + calculateBettingRoundSpendingForPlayer(br, playerId),
    0
  );
};

export const getCurrentQuestionRound = (game?: Game) =>
  game?.questionRounds[game?.questionRounds?.length - 1];

export const getCurrentBettingRound = (currentQuestionRound?: QuestionRound) =>
  currentQuestionRound?.bettingRounds[
    currentQuestionRound?.bettingRounds?.length - 1
  ];

export const haveAllPlayersPlacedTheirBets = (
  currentQuestionRound: QuestionRound,
  players: Player[]
) => {
  const currentBettingRound = getCurrentBettingRound(currentQuestionRound);
  const remainingPlayers = players.filter(
    (player) =>
      currentBettingRound &&
      (player.money > 0 ||
        calculateBettingRoundSpendingForPlayer(currentBettingRound, player.id))
  );
  return currentQuestionRound.guesses.length === remainingPlayers.length;
};

export const isPlayerDead = (
  currentQuestionRound: QuestionRound,
  player: Omit<Player, "name">
) => {
  if (player.money > 0) {
    return false;
  }
  const amountInQuestionRound = calculateQuestionRoundSpendingForPlayer(
    player.id,
    currentQuestionRound
  );
  if (
    amountInQuestionRound &&
    amountInQuestionRound > 0 &&
    !hasFolded(currentQuestionRound, player.id)
  ) {
    return false;
  }
  return true;
};

export const calculateAmountToCall = (
  bettingRound: BettingRound,
  playerId: Player["id"]
): number => {
  if (!bettingRound.bets.length) return 0;
  const amountSpentAlreadyInBettingRound = calculateBettingRoundSpendingForPlayer(
    bettingRound,
    playerId
  );

  const amountSpentInBettingRoundPerPlayer = bettingRound.bets.reduce(
    (acc, bet) => {
      acc[bet.playerId] = (acc[bet.playerId] || 0) + bet.amount;
      return acc;
    },
    {} as { [key: string]: number }
  );

  return (
    Math.max(...Object.values(amountSpentInBettingRoundPerPlayer)) -
    amountSpentAlreadyInBettingRound
  );
};

export const hasFolded = (
  currentQuestionRound: QuestionRound,
  playerId: Player["id"]
) => currentQuestionRound?.foldedPlayerIds.includes(playerId);
