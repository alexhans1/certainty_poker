import { getFunctions, httpsCallable } from "firebase/functions";
import app from "../firebase";
import { BetInput } from "../interfaces";

const functions = getFunctions(app, "europe-west3");

const startGameCallable = httpsCallable<{ gameId: string }, void>(
  functions,
  "startGame"
);
export const startGame = async (payload: { gameId: string }) => {
  try {
    await startGameCallable(payload);
  } catch (error) {
    console.log("error", error);
  }
};

const placeBetCallable = httpsCallable<BetInput, void>(functions, "placeBet");
export const placeBet = async (payload: BetInput) => {
  try {
    await placeBetCallable(payload);
  } catch (error) {
    console.log("error", error);
  }
};

const removePlayerCallable = httpsCallable<
  { gameId: string; playerId: string },
  void
>(functions, "removePlayer");
export const removePlayer = async (payload: {
  gameId: string;
  playerId: string;
}) => {
  try {
    await removePlayerCallable(payload);
  } catch (error) {
    console.log("error", error);
  }
};
