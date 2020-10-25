import { Player, Game, BetInput } from "../../../interfaces";
import { getCurrentQuestionRound, getCurrentBettingRound } from ".";
import { calculateAmountToCall } from "./helpers";

export type PlaceBet = ({
  variables: { input },
}: {
  variables: { input: BetInput };
}) => void;

export const check = (
  placeBet: PlaceBet,
  game: Game,
  playerId: Player["id"]
) => {
  const currentQuestionRound = getCurrentQuestionRound(game);
  const currentBettingRound = getCurrentBettingRound(currentQuestionRound);
  if (
    !currentQuestionRound ||
    currentBettingRound?.currentPlayer.id !== playerId
  ) {
    return;
  }

  const amountToCall = calculateAmountToCall(currentBettingRound, playerId);
  if (amountToCall > 0) {
    // cannot check
    return;
  }

  placeBet({
    variables: {
      input: {
        gameId: game.id,
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
    currentBettingRound?.currentPlayer.id !== playerId
  ) {
    return;
  }

  const amountToCall = calculateAmountToCall(currentBettingRound, playerId);
  const moneyOfPlayer =
    game.players.find(({ id }) => id === playerId)?.money ?? 0;

  placeBet({
    variables: {
      input: {
        gameId: game.id,
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
    currentBettingRound?.currentPlayer.id !== playerId
  ) {
    return;
  }

  const amountToCall = calculateAmountToCall(currentBettingRound, playerId);
  if (amountToCall > amount) {
    throw new Error("Amount to call is greater than raised amount.");
  }

  const moneyOfPlayer =
    game.players.find(({ id }) => id === playerId)?.money ?? 0;

  placeBet({
    variables: {
      input: {
        gameId: game.id,
        playerId: playerId,
        amount: Math.min(amount, moneyOfPlayer),
      },
    },
  });
};

export const fold = (
  placeBet: PlaceBet,
  game: Game,
  playerId: Player["id"]
) => {
  const currentQuestionRound = getCurrentQuestionRound(game);
  const currentBettingRound = getCurrentBettingRound(currentQuestionRound);
  if (
    !currentQuestionRound ||
    currentBettingRound?.currentPlayer.id !== playerId
  ) {
    return;
  }

  placeBet({
    variables: {
      input: {
        gameId: game.id,
        playerId: playerId,
        amount: -1,
      },
    },
  });
};
