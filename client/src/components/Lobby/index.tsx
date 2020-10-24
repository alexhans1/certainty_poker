import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useMutation } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import { Game } from "../../interfaces";

const CREATE_GAME_QUERY = gql`
  mutation createGame {
    createGame {
      id
    }
  }
`;

function Lobby() {
  const history = useHistory();
  const [createGame, { loading, data, error }] = useMutation<{
    createGame: Game;
  }>(CREATE_GAME_QUERY);
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
      <br/>
      <button className="btn btn-primary" onClick={handleCreateGame}>
        {loading ? "Loading..." : "Create Game"}
      </button>
    </>
  );
}

export default Lobby;
