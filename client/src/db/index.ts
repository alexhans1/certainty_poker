// Import the functions you need from the SDKs you need
import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  getFirestore,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import app from "../firebase";
import {
  Game,
  Guess,
  Player,
  Question,
  QuestionRound,
  Set,
} from "../interfaces";
import { v4 } from "uuid";
import countryCodes from "../assets/countryCodes";

const db = getFirestore(app, "certainty-poker");

export default db;

export const createGame = async (
  selectedSets: Set[],
  onComplete: (gameId: string) => void
) => {
  const newGame: Omit<Game, "id"> & { ttl: Timestamp } = {
    questionRounds: [],
    questions: selectedSets.reduce<Question[]>((acc, set) => {
      return [...acc, ...set.questions];
    }, []),
    isOver: false,
    players: [],
    dealerId: "unassigned",
    setNames: selectedSets.map(({ setName }) => setName),
    ttl: Timestamp.fromMillis(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days
  };
  const docRef = await addDoc(collection(db, "games"), newGame);
  onComplete(docRef.id);
};

export const createPlayer = async (
  gameId: string,
  playerName: string,
  onComplete: (playerId: string) => void
) => {
  const player: Player = {
    id: v4(),
    name: playerName,
    money: 100,
    isDead: false,
  };

  // Add the player to the players array
  await updateDoc(doc(db, "games", gameId), {
    players: arrayUnion(player),
  });
  onComplete(player.id);
};

export const addGuess = async (
  gameId: string,
  questionRounds: QuestionRound[],
  currentQuestionRound: QuestionRound,
  guess: Guess
) => {
  const updatedQuestionRound = {
    ...currentQuestionRound,
    guesses: [...currentQuestionRound.guesses, guess],
  };

  const updatedQuestionRounds = [...questionRounds];
  updatedQuestionRounds[updatedQuestionRounds.length - 1] =
    updatedQuestionRound;

  await updateDoc(doc(db, "games", gameId), {
    questionRounds: updatedQuestionRounds,
  });
};

export const uploadQuestions = async (
  questions: Question[],
  setName: string,
  language: keyof typeof countryCodes,
  _isPrivate?: boolean
) => {
  const newSet: Set = {
    questions,
    setName,
    language,
  };

  await addDoc(collection(db, "question-sets"), newSet);
};

export const revealGuess = async (
  gameId: string,
  playerId: string,
  questionRounds: QuestionRound[]
) => {
  const currentQuestionRound = questionRounds[questionRounds.length - 2];
  if (!currentQuestionRound) {
    return;
  }

  if (currentQuestionRound.revealedGuesses.includes(playerId)) {
    console.log("playerId", playerId);
    return;
  }

  const updatedQuestionRound = {
    ...currentQuestionRound,
    revealedGuesses: [...currentQuestionRound.revealedGuesses, playerId],
  };

  const updatedQuestionRounds = [...questionRounds];
  updatedQuestionRounds[updatedQuestionRounds.length - 2] =
    updatedQuestionRound;

  await updateDoc(doc(db, "games", gameId), {
    questionRounds: updatedQuestionRounds,
  });
};
