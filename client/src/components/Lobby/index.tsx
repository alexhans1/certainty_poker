import React, { useEffect, useState } from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import { useLazyQuery, useMutation } from "@apollo/react-hooks";
import { useLocation } from "react-router-dom";
import { Game, Set } from "../../interfaces";
import { CREATE_GAME_QUERY, GET_SETS_QUERY } from "../../api/queries";
import errorHandler from "../../api/errorHandler";
import UploadModal from "./UploadModal";

import "./styles.scss";

function Lobby() {
  const { setName } = useParams<{ setName: string }>();
  const history = useHistory();
  const location = useLocation();
  const [selectedSets, setSelectedSets] = useState<string[]>(
    setName ? [setName] : []
  );
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [createGame, { loading }] = useMutation<{
    createGame: Game;
  }>(CREATE_GAME_QUERY, {
    variables: {
      setNames: selectedSets,
    },
    onCompleted: ({ createGame }) => {
      history.push(`/${createGame.id}`);
    },
    onError: errorHandler,
  });
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

  const handleCreateGame = async () => {
    if (selectedSets.length) {
      createGame();
    }
  };

  return (
    <>
      {setName ? (
        <p>
          You can only start a game with these questions from this link{" "}
          <Link
            to={location.pathname}
            style={{ color: "#dfae06" }}
          >{`${window.location.host}${location.pathname}`}</Link>
          .
          <br />
          Make sure to <b>save this link</b> if you want to start a game with
          the uploaded questions later.
          <br />
          The questions will be available for 90 days.
        </p>
      ) : (
        <p className="mt-3">
          Start by selecting one or more sets of trivia questions or upload your
          own{" "}
          <button
            className="btn btn-link p-0"
            onClick={() => {
              setIsUploadModalOpen(true);
            }}
          >
            here ⤴
          </button>
          .
        </p>
      )}
      <div className="set-container my-4">
        {sets?.sets.map((set) => (
          <span
            key={set.setName}
            className={`set badge border-light ${
              selectedSets?.includes(set.setName) ? "badge-light" : ""
            } ${setName ? "mr-auto" : ""}`}
            style={{
              gridColumn: `span ${Math.round(
                Math.pow(set.setName.length, 0.35)
              )}`,
            }}
            onClick={(e) => {
              if (setName) {
                return;
              }
              if (e.metaKey) {
                if (selectedSets?.includes(set.setName)) {
                  setSelectedSets(
                    selectedSets.filter((setName) => set.setName !== setName)
                  );
                } else {
                  setSelectedSets([set.setName, ...selectedSets]);
                }
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
        fetchSets={fetchSets}
        setSelectedSets={setSelectedSets}
      />
    </>
  );
}

export default Lobby;
