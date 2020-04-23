import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useLazyQuery, useMutation } from "@apollo/react-hooks";
import { GET_GAME_BY_ID, CREATE_PLAYER, START_GAME } from "../../api/queries";
import { Game, Player } from "../../interfaces";
import { getPlayerIdFromStorage, setPlayerIdToStorage } from "../../storage";
import PlayerTable from "./PlayerTable";

function GameComponent() {
  const [playerId, setPlayerId] = useState<string | undefined>(undefined);
  const [game, setGame] = useState<Game | undefined>(undefined);
  const { game_id: gameId } = useParams();

  const [
    fetchGame,
    { data: fetchGameData, loading: fetchGameLoading, error: fetchGameError },
  ] = useLazyQuery<{ game: Game }>(GET_GAME_BY_ID, {
    fetchPolicy: "cache-and-network",
  });

  const [
    createPlayer,
    { data: newPlayerData, loading: addPlayerLoading, error: addPlayerError },
  ] = useMutation<{ addPlayer: Player }>(CREATE_PLAYER);

  const [
    startGame,
    { data: startGameData, loading: startGameLoading, error: startGameError },
  ] = useMutation<{ startGame: Game }>(START_GAME);

  useEffect(() => {
    if (gameId) {
      const storedPlayerId = getPlayerIdFromStorage(gameId);
      const newPlayerId = newPlayerData?.addPlayer?.id;

      if (storedPlayerId) {
        setPlayerId(storedPlayerId);
      }

      if (newPlayerId) {
        setPlayerIdToStorage(gameId, newPlayerId);
        setPlayerId(newPlayerId);
      }

      if (!storedPlayerId && !newPlayerId) {
        createPlayer({
          variables: { gameId },
        });
      }
      fetchGame({
        variables: { gameId },
      });
    }

    setGame(fetchGameData?.game || startGameData?.startGame);
  }, [
    gameId,
    playerId,
    newPlayerData,
    createPlayer,
    fetchGame,
    fetchGameData,
    startGameData,
  ]);

  if (fetchGameError || addPlayerError || startGameError) {
    console.error(fetchGameError || addPlayerError || startGameError);
    return <p>A technical error occurred. Try to refresh the page</p>;
  }

  const currentQuestionRound = game?.questionRounds[game.currentQuestionRound];
  const currentBettingRound =
    currentQuestionRound?.bettingRounds[
      currentQuestionRound?.currentBettingRound
    ];
  return (
    <div className="container">
      {(fetchGameLoading || addPlayerLoading || startGameLoading) && (
        <p>Loading...</p>
      )}
      <button
        className="btn btn-primary m-3"
        disabled={(game?.currentQuestionRound ?? -1) > -1}
        onClick={() => {
          startGame({
            variables: { gameId },
          });
        }}
      >
        Start Game
      </button>
      <button
        className="btn btn-primary"
        onClick={() => {
          fetchGame({
            variables: { gameId },
          });
        }}
      >
        Refresh
      </button>
      <div className="d-flex flex-row">
        <PlayerTable
          {...{
            players: game?.players,
            playerId,
            currentQuestionRound,
            currentBettingRound,
          }}
        />
        {currentQuestionRound && (
          <div>
            <p>Question: {currentQuestionRound.question.question}</p>
            <p>
              Hint:{" "}
              {
                currentQuestionRound.question.hints[
                  currentQuestionRound.currentBettingRound - 1
                ]
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default GameComponent;
