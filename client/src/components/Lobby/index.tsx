import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { useLazyQuery } from "@apollo/client";
import { Set } from "../../interfaces";
import { GET_SETS_QUERY } from "../../api/queries";
import PictureHalf from "./PictureHalf";
import ActionableHalf from "./ActionableHalf";
import { collection, onSnapshot, QuerySnapshot } from "firebase/firestore";
import db from "../../db/firestore-config";

import "./styles.css";

function Lobby() {
  const { setName } = useParams<{ setName: string }>();
  const [questionSets, setQuestionSets] = useState<Set[]>([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "question-sets"),
      (querySnapshot) => {
        const newData = querySnapshot.docs.map<Set>((doc) => doc.data() as Set);
        console.log("newData", newData);
        setQuestionSets(newData);
      }
    );

    // Cleanup subscription on component unmount
    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <div className="grid lg:grid-cols-2 gap-x-8 relative landing-page">
      <ActionableHalf {...{ sets: questionSets, setName }} />
      {/* <PictureHalf /> */}
    </div>
  );
}

export default Lobby;
