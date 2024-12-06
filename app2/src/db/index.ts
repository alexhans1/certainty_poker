// Import the functions you need from the SDKs you need
import { getFirestore } from "firebase/firestore";
import app from "../firebase";

const db = getFirestore(app, "certainty-poker");

export default db;
