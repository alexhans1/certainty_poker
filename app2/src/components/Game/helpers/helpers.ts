import { arrayUnion, doc, updateDoc } from "firebase/firestore";
import {
  QuestionRound,
  Player,
  Game,
  BettingRound,
  QuestionTypes,
  Question,
} from "../../../interfaces";
import db from "../../../db/firestore-config";

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
  game?.questionRounds[game?.questionRounds?.length - 1];

export const getPreviousQuestionRound = (game?: Game) =>
  game?.questionRounds[game?.questionRounds?.length - (game.isOver ? 1 : 2)];

export const getCurrentBettingRound = (currentQuestionRound?: QuestionRound) =>
  currentQuestionRound?.bettingRounds[
    currentQuestionRound?.bettingRounds?.length - 1
  ];

export const haveAllPlayersPlacedTheirGuess = (
  currentQuestionRound: QuestionRound,
  players: Player[]
) => {
  const remainingPlayers = players.filter((player) => !player.isDead);
  return currentQuestionRound.guesses.length >= remainingPlayers.length;
};

export const calculateAmountToCall = (
  bettingRound: BettingRound,
  playerId: Player["id"]
): number => {
  if (!bettingRound.bets.length) return 0;
  const amountSpentAlreadyInBettingRound =
    calculateBettingRoundSpendingForPlayer(bettingRound, playerId);

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

export const hasPlayerFolded = (
  currentQuestionRound: QuestionRound,
  playerId: Player["id"]
) => currentQuestionRound?.foldedPlayerIds.includes(playerId);

export const getRevealAnswer = (questionRound: QuestionRound) => {
  if (questionRound.isOver) {
    return true;
  }
  if (questionRound.question.type === QuestionTypes.MULTIPLE_CHOICE) {
    return questionRound.bettingRounds.length >= 4;
  }
  return (
    questionRound.question.hints.length + 1 < questionRound.bettingRounds.length
  );
};

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export async function shufflePlayersInGame(gameId: string, players: Player[]) {
  try {
    const shuffledPlayers = shuffleArray(players);

    // Update Firestore with the shuffled players array
    await updateDoc(doc(db, "games", gameId), {
      players: shuffledPlayers,
    });
  } catch (error) {
    console.error("Error shuffling players:", error);
    throw error;
  }
}

function findNextDealer(
  players: Player[],
  dealerId: Player["id"]
): Player["id"] {
  const currentIndex = players.findIndex((player) => player.id === dealerId);
  const nextIndex = (currentIndex + 1) % players.length;
  return players[nextIndex].id;
}

// find next player that is not yet dead
function findNextActionablePlayer(
  players: Player[],
  dealerId: Player["id"]
): Player {
  const dealerIndex = players.findIndex((player) => player.id === dealerId);
  const nextActionablePlayer =
    players.slice(dealerIndex + 1).find((player) => !player.isDead) ||
    players.find((player) => !player.isDead) ||
    players[0];
  return nextActionablePlayer;
}

function addNewBettingRound(game: Game): BettingRound {
  return {
    bets: [],
    currentPlayer: findNextActionablePlayer(game.players, game.dealerId),
  };
}

export async function addQuestionRound(game: Game) {
  const newQuestionRound: QuestionRound = {
    question: game.questions[game.questionRounds.length],
    guesses: [],
    bettingRounds: [addNewBettingRound(game)],
    foldedPlayerIds: [],
    isOver: false,
    isShowdown: false,
    revealedGuesses: [],
  };

  const updatedPlayers = game.players.map((player) => ({
    ...player,
    bettingState: null,
  }));

  try {
    await updateDoc(doc(db, "games", game.id), {
      questionRounds: arrayUnion(newQuestionRound),
      players: updatedPlayers,
      dealerId:
        game.dealerId === "unassigned"
          ? game.players[0].id
          : findNextDealer(game.players, game.dealerId),
    });
  } catch (error) {
    console.error("Error while adding new question round:", error);
    throw error;
  }
}
