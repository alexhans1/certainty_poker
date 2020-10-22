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
