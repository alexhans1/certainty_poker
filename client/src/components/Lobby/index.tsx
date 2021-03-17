import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useLazyQuery } from "@apollo/react-hooks";
import { Set } from "../../interfaces";
import { GET_SETS_QUERY } from "../../api/queries";
import errorHandler from "../../api/errorHandler";
import PictureHalf from "./PictureHalf";
import ActionableHalf from "./ActionableHalf";

import "./styles.css";

function Lobby() {
  const { setName } = useParams<{ setName: string }>();
  const [fetchSets, { data: sets }] = useLazyQuery<{
    sets: Set[];
  }>(GET_SETS_QUERY, {
    fetchPolicy: "no-cache",
    onError: errorHandler,
    variables: { setName },
  });

  useEffect(() => {
    fetchSets();
  }, [fetchSets, setName]);

  return (
    <div className="grid lg:grid-cols-2 gap-x-8 relative landing-page">
      <ActionableHalf {...{ sets: sets?.sets, setName, fetchSets }} />
      <PictureHalf />
    </div>
  );
}

export default Lobby;
