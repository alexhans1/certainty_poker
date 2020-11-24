import {
  QuestionRound,
  Player,
  Game,
  BettingRound,
  QuestionTypes,
  Answer,
} from "../../../interfaces";

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

export const hasPlayerFolded = (
  currentQuestionRound: QuestionRound,
  playerId: Player["id"]
) => currentQuestionRound?.foldedPlayerIds.includes(playerId);

export const getRevealAnswer = (questionRound: QuestionRound) =>
  questionRound.isOver ||
  questionRound.question.hints.length + 1 < questionRound.bettingRounds.length;

export const getGuess = (guess: Answer, questionType?: QuestionTypes) => {
  if (!guess) return;
  switch (questionType) {
    case QuestionTypes.NUMERICAL:
      return guess.numerical;
    case QuestionTypes.GEO:
      return `[${guess.geo?.latitude}, ${guess.geo?.longitude}]`;
    default:
      throw new Error("Invalid question type");
  }
};
