export type GeoCoordinate = [number, number];
export type GuessType = number | GeoCoordinate;

export enum QuestionTypes {
  GEO = "geo",
  NUMERICAL = "numerical",
  MULTIPLE_CHOICE = "multiple_choice",
  DATE = "date",
}

export interface Player {
  id: string;
  money: number;
  name: string;
  isDead: boolean;
}

export interface Question {
  id: string;
  type: QuestionTypes;
  question: string;
  answer: number;
  hints: string[];
  explanation?: string;
}

export interface Guess {
  playerId: Player["id"];
  guess: GuessType;
}

interface Bet {
  playerId: Player["id"];
  amount: number;
}

export interface BettingRound {
  bets: Bet[];
  currentPlayer: Player;
}

interface QuestionRoundResult {
  playerId: Player["id"];
  changeInMoney: number;
}

export interface QuestionRound {
  question: Question;
  guesses: Guess[];
  bettingRounds: BettingRound[];
  foldedPlayerIds: Player["id"][];
  results?: QuestionRoundResult[];
  isOver: boolean;
  isShowdown: boolean;
}

export interface Game {
  id: string;
  players: Player[];
  questionRounds: QuestionRound[];
  dealerId: Player["id"];
  questions: Omit<Question, "question" | "answer" | "hints">[];
  isOver: boolean;
}

export interface BetInput {
  gameId: Game["id"];
  playerId: Player["id"];
  amount: number;
}

export interface GuessInput {
  gameId: Game["id"];
  playerId: Player["id"];
  guess: GuessType;
}

export interface Set {
  setName: string;
  numberOfQuestions: number;
}
