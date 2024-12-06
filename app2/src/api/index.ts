import { getFunctions, httpsCallable } from "firebase/functions";
import app from "../firebase";
import { BetInput } from "../interfaces";

const functions = getFunctions(app, "europe-west3");
const startGameCallable = httpsCallable<{ gameId: string }, void>(
  functions,
  "startGame"
);
const placeBetCallable = httpsCallable<BetInput, void>(functions, "placeBet");

export const startGame = async (payload: { gameId: string }) => {
  try {
    await startGameCallable(payload);
  } catch (error) {
    console.error("Error calling startGame:", error);
    throw error;
  }
};

export const placeBet = async (payload: BetInput) => {
  try {
    await placeBetCallable(payload);
  } catch (error) {
    console.error("Error calling placeBet:", error);
    throw error;
  }
};
