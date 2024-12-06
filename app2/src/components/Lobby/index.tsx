import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { Set } from "../../interfaces.ts";
import PictureHalf from "./PictureHalf";
import ActionableHalf from "./ActionableHalf";
import { collection, getDocs } from "firebase/firestore";
import db from "../../db";

import "./styles.css";

function Lobby() {
  const { setName } = useParams<{ setName: string }>();
  const [questionSets, setQuestionSets] = useState<Set[]>([]);

  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "question-sets"));
        const newData = querySnapshot.docs.map((doc) => doc.data() as Set);
        setQuestionSets(newData);
      } catch (error) {
        console.error("Error fetching question sets:", error);
      }
    };

    if (isMounted) {
      fetchData();
    }

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="grid lg:grid-cols-2 gap-x-8 relative landing-page">
      <ActionableHalf {...{ sets: questionSets, setName }} />
      <PictureHalf />
    </div>
  );
}

export default Lobby;
