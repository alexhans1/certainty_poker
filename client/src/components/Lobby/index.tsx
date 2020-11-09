import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { useMutation, useQuery } from "@apollo/react-hooks";
import { Game, Set } from "../../interfaces";
import { CREATE_GAME_QUERY, GET_SETS_QUERY } from "../../api/queries";

import "./styles.scss";

function Lobby() {
  const history = useHistory();
  const [selectedSets, setSelectedSets] = useState<string[]>([]);
  const [createGame, { loading, data, error }] = useMutation<{
    createGame: Game;
  }>(CREATE_GAME_QUERY, {
    variables: {
      setNames: selectedSets,
    },
  });
  if (error) {
    console.error(error);
  }
  const { error: setsError, data: sets } = useQuery<{ sets: Set[] }>(
    GET_SETS_QUERY
  );
  if (setsError) {
    console.error(setsError);
  }
  useEffect(() => {
    if (data && !loading) {
      history.push(`/${data.createGame.id}`);
    }
  }, [history, data, loading]);
  const handleCreateGame = async () => {
    if (selectedSets.length) {
      createGame();
    }
  };
  return (
    <>
      <div className="set-container">
        {sets?.sets.map((set) => (
          <span
            key={set.setName}
            className={`set badge  border-light ${
              selectedSets?.includes(set.setName) ? "badge-light" : ""
            }`}
            style={{
              gridColumn: `span ${Math.round(
                Math.pow(set.setName.length, 0.35)
              )}`,
            }}
            onClick={(e) => {
              if (selectedSets?.includes(set.setName)) {
                setSelectedSets(
                  selectedSets.filter((setName) => set.setName !== setName)
                );
              } else if (e.metaKey) {
                setSelectedSets([set.setName, ...selectedSets]);
              } else {
                setSelectedSets([set.setName]);
              }
            }}
          >
            {set.setName} ({set.numberOfQuestions})
          </span>
        ))}
      </div>
      <p className="mt-3">
        Start a new game or open a link of an existing game.
      </p>
      <button
        className="btn btn-lg btn-primary mt-auto mb-3 mx-5"
        onClick={handleCreateGame}
        disabled={!selectedSets.length}
      >
        {loading ? "Loading..." : "Create Game"}
      </button>
    </>
  );
}

export default Lobby;
