import {
  QuestionRound,
  Player,
  Game,
  BettingRound,
  BetInput,
} from "../../interfaces";

export const calculateBettingRoundSpendingForPlayer = (
  bettingRound: BettingRound,
  playerId: Player["id"]
) => {
  return bettingRound.bets.reduce(
    (sum, bet) => sum + (bet.playerId === playerId ? bet.amount : 0),
    0
  );
};

export const getCurrentQuestionRound = (game?: Game) =>
  game?.questionRounds[game.currentQuestionRound];

export const getCurrentBettingRound = (currentQuestionRound?: QuestionRound) =>
  currentQuestionRound?.bettingRounds[
    currentQuestionRound?.currentBettingRound
  ];

type PlaceBet = ({
  variables: { input },
}: {
  variables: { input: BetInput };
}) => void;

const calculateAmountToCall = (bettingRound: BettingRound): number => {
  return Math.max(
    ...Object.values(
      bettingRound.bets.reduce((acc, bet) => {
        acc[bet.playerId] = acc[bet.playerId] || 0 + bet.amount;
        return acc;
      }, {} as { [key: string]: number })
    )
  );
};

export const check = (
  placeBet: PlaceBet,
  game: Game,
  playerId: Player["id"]
) => {
  const currentQuestionRound = getCurrentQuestionRound(game);
  const currentBettingRound = getCurrentBettingRound(currentQuestionRound);
  if (
    !currentQuestionRound ||
    currentBettingRound?.currentPlayerId !== playerId
  ) {
    return;
  }

  placeBet({
    variables: {
      input: {
        gameId: game.id,
        questionRoundId: currentQuestionRound?.id,
        bettingRoundId: currentBettingRound.id,
        playerId: playerId,
        amount: 0,
      },
    },
  });
};

export const call = (
  placeBet: PlaceBet,
  game: Game,
  playerId: Player["id"]
) => {
  const currentQuestionRound = getCurrentQuestionRound(game);
  const currentBettingRound = getCurrentBettingRound(currentQuestionRound);
  if (
    !currentQuestionRound ||
    currentBettingRound?.currentPlayerId !== playerId
  ) {
    return;
  }

  const amountToCall = calculateAmountToCall(currentBettingRound);
  const moneyOfPlayer =
    game.players.find(({ id }) => id === playerId)?.money ?? 0;

  placeBet({
    variables: {
      input: {
        gameId: game.id,
        questionRoundId: currentQuestionRound?.id,
        bettingRoundId: currentBettingRound.id,
        playerId: playerId,
        amount: Math.min(amountToCall, moneyOfPlayer),
      },
    },
  });
};

export const raise = (
  amount: number,
  placeBet: PlaceBet,
  game: Game,
  playerId: Player["id"]
) => {
  const currentQuestionRound = getCurrentQuestionRound(game);
  const currentBettingRound = getCurrentBettingRound(currentQuestionRound);
  if (
    !currentQuestionRound ||
    currentBettingRound?.currentPlayerId !== playerId
  ) {
    return;
  }

  const amountToCall = calculateAmountToCall(currentBettingRound);
  if (amountToCall > amount) {
    throw new Error("Amount to call is greater than raised amount.");
  }

  const moneyOfPlayer =
    game.players.find(({ id }) => id === playerId)?.money ?? 0;

  placeBet({
    variables: {
      input: {
        gameId: game.id,
        questionRoundId: currentQuestionRound?.id,
        bettingRoundId: currentBettingRound.id,
        playerId: playerId,
        amount: Math.min(amount, moneyOfPlayer),
      },
    },
  });
};
