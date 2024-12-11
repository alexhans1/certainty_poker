import { getCurrentBettingRound, getCurrentQuestionRound } from ".";
import { Game, Player } from "../../../interfaces";
import { calculateAmountToCall } from "./helpers";

export type PlaceBet = (amount: number) => Promise<void>;

export const check = async (
  placeBet: PlaceBet,
  game: Game,
  playerId: Player["id"],
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

  await placeBet(0);
};

export const call = async (
  placeBet: PlaceBet,
  game: Game,
  playerId: Player["id"],
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

  await placeBet(Math.min(amountToCall, moneyOfPlayer));
};

export const raise = async (
  amount: number,
  placeBet: PlaceBet,
  game: Game,
  playerId: Player["id"],
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

  await placeBet(Math.min(amount, moneyOfPlayer));
};

export const fold = async (
  placeBet: PlaceBet,
  game: Game,
  playerId: Player["id"],
) => {
  const currentQuestionRound = getCurrentQuestionRound(game);
  const currentBettingRound = getCurrentBettingRound(currentQuestionRound);
  if (
    !currentQuestionRound ||
    currentBettingRound?.currentPlayer.id !== playerId
  ) {
    return;
  }

  await placeBet(-1);
};
