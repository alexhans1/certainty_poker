// Import the functions you need from the SDKs you need
import {
  addDoc,
  collection,
  getFirestore,
  Timestamp,
} from "firebase/firestore";
import app from "../firebase";
import { Game, Question, Set } from "../interfaces";

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
  try {
    const docRef = await addDoc(collection(db, "games"), newGame);
    onComplete(docRef.id);
  } catch (e) {
    console.error("Error adding document: ", e);
    throw e;
  }
};
