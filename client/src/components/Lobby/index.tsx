import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useLazyQuery } from "@apollo/react-hooks";
import { Set } from "../../interfaces";
import { GET_SETS_QUERY } from "../../api/queries";
import errorHandler from "../../api/errorHandler";
import PictureHalf from "./PictureHalf";
import ActionableHalf from "./ActionableHalf";

import "./styles.scss";

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

  const languages =
    sets?.sets
      .reduce<string[]>((uniqueLanguages, s) => {
        if (!uniqueLanguages.includes(s.language)) {
          uniqueLanguages.push(s.language);
        }
        return uniqueLanguages;
      }, [])
      .sort((a, b) => {
        if (a === "GB") {
          return -1;
        }
        return parseInt(a) - parseInt(b);
      }) || [];

  return (
    <div className="grid-container">
      <ActionableHalf
        {...{ sets: sets?.sets, languages, setName, fetchSets }}
      />
      <PictureHalf />
    </div>
  );
}

export default Lobby;
