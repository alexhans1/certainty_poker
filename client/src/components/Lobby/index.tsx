import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { useMutation, useQuery } from "@apollo/react-hooks";
import { Game, Set } from "../../interfaces";
import { CREATE_GAME_QUERY, GET_SETS_QUERY } from "../../api/queries";
import UploadModal from "./UploadModal";

import "./styles.scss";

function Lobby() {
  const history = useHistory();
  const [selectedSets, setSelectedSets] = useState<string[]>([]);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
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
      <p className="mt-3">
        Start by selecting one or more sets of trivia questions or upload your
        own{" "}
        <button
          className="btn btn-primary"
          onClick={() => {
            setIsUploadModalOpen(true);
          }}
        >
          here ⤴
        </button>
        .
      </p>
      <div className="set-container my-4">
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
      <button
        className="btn btn-lg btn-primary mt-auto mb-3 mx-5"
        onClick={handleCreateGame}
        disabled={!selectedSets.length}
      >
        {loading ? "Loading..." : "Create Game"}
      </button>

      <UploadModal
        open={isUploadModalOpen}
        handleClose={() => {
          setIsUploadModalOpen(false);
        }}
      />
    </>
  );
}

export default Lobby;
