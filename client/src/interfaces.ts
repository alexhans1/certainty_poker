export enum QuestionTypes {
  GEO = "GEO",
  NUMERICAL = "NUMERICAL",
  MULTIPLE_CHOICE = "MULTIPLE_CHOICE",
  DATE = "DATE",
}

export interface GeoCoordinate {
  latitude: number;
  longitude: number;
}

export interface Player {
  id: string;
  money: number;
  name: string;
  isDead: boolean;
}

export interface Answer {
  numerical?: number;
  geo?: GeoCoordinate;
}

export interface Question {
  id: string;
  type: QuestionTypes;
  question: string;
  answer: Answer;
  alternatives?: [string, string, string, string];
  hiddenAlternatives?: string[];
  hints: string[];
  explanation?: string;
}

export interface Guess {
  playerId: Player["id"];
  guess: Answer;
  difference?: number;
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
  guess: Answer;
}

export interface Set {
  setName: string;
  numberOfQuestions: number;
  language: string;
}
