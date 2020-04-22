export interface Player {
  id: string;
  money: number;
}

interface Question {
  id: string;
  question: string;
  answer: number;
  hints: string[];
}

interface Guess {
  playerId: Player["id"];
  guess: number;
}

interface Bet {
  playerId: Player["id"];
  amount: number;
}

interface BettingRound {
  id: string;
  bets: Bet[];
  currentPlayerId: Player["id"];
  lastRaisedPlayerId: Player["id"];
}

interface QuestionRound {
  id: string;
  question: Question;
  guesses: Guess[];
  bettingRounds: BettingRound[];
  currentBettingRound: number;
  folderPlayerIds: Player["id"][];
}

export interface Game {
  id: string;
  players: Player[];
  questionRounds: QuestionRound[];
  currentQuestionRound: number;
  dealerId: Player["id"];
}
