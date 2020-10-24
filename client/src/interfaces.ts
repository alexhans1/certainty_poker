export interface Player {
  id: string;
  money: number;
}

export interface Question {
  id: string;
  question: string;
  answer: number;
  hints: string[];
}

export interface Guess {
  playerId: Player["id"];
  guess: number;
}

interface Bet {
  playerId: Player["id"];
  amount: number;
}

export interface BettingRound {
  bets: Bet[];
  currentPlayer: Player;
}

export interface QuestionRound {
  question: Question;
  guesses: Guess[];
  bettingRounds: BettingRound[];
  foldedPlayerIds: Player["id"][];
}

export interface Game {
  id: string;
  players: Player[];
  questionRounds: QuestionRound[];
  dealerId: Player["id"];
}

export interface BetInput {
  gameId: Game["id"];
  playerId: Player["id"];
  amount: number;
}

export interface GuessInput {
  gameId: Game["id"];
  playerId: Player["id"];
  guess: number;
}
