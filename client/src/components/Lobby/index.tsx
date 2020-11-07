import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useMutation } from "@apollo/react-hooks";
import { Game } from "../../interfaces";
import { CREATE_GAME_QUERY } from "../../api/queries";

function Lobby() {
  const history = useHistory();
  const [createGame, { loading, data, error }] = useMutation<{
    createGame: Game;
  }>(CREATE_GAME_QUERY, {
    variables: {
      setName: "DefaultQuestions",
    },
  });
  if (error) {
    console.error(error);
  }
  useEffect(() => {
    if (data && !loading) {
      history.push(`/${data.createGame.id}`);
    }
  }, [history, data, loading]);
  const handleCreateGame = async () => {
    createGame();
  };
  return (
    <>
      <p className="mt-3">
        Start a new game or open a link of an existing game.
      </p>
      <button
        className="btn btn-lg btn-primary mt-auto mb-3 mx-5"
        onClick={handleCreateGame}
      >
        {loading ? "Loading..." : "Create Game"}
      </button>
    </>
  );
}

export default Lobby;
