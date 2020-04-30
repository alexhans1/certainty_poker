import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useLazyQuery, useMutation } from "@apollo/react-hooks";
import {
  GET_GAME_BY_ID,
  CREATE_PLAYER,
  START_GAME,
  PLACE_BET,
} from "../../api/queries";
import { Game, Player } from "../../interfaces";
import { getPlayerIdFromStorage, setPlayerIdToStorage } from "../../storage";
import PlayerTable from "./PlayerTable";
import Hints from "./Hints";
import ActionButton from "./ActionButton";
import {
  getCurrentQuestionRound,
  getCurrentBettingRound,
  check,
  call,
  raise,
} from "./helpers";

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

  const [
    placeBet,
    { data: placeBetData, loading: placeBetLoading, error: placeBetError },
  ] = useMutation<{ placeBet: Game }>(PLACE_BET);

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

    setGame(
      fetchGameData?.game || startGameData?.startGame || placeBetData?.placeBet
    );
  }, [
    gameId,
    playerId,
    newPlayerData,
    createPlayer,
    fetchGame,
    fetchGameData,
    startGameData,
    placeBetData,
  ]);

  if (!game || !playerId) {
    return <h3>Loading...</h3>;
  }

  if (fetchGameError || addPlayerError || startGameError || placeBetError) {
    console.error(
      fetchGameError || addPlayerError || startGameError || placeBetError
    );
    return <p>A technical error occurred. Try to refresh the page</p>;
  }

  const currentQuestionRound = getCurrentQuestionRound(game);
  const currentBettingRound = getCurrentBettingRound(currentQuestionRound);
  return (
    <div className="container">
      {(fetchGameLoading ||
        addPlayerLoading ||
        startGameLoading ||
        placeBetLoading) && <p>Loading...</p>}
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
          <div className="ml-5">
            <p>Question:</p>
            <p>
              <b>{currentQuestionRound.question.question}</b>
            </p>
            <Hints
              currentQuestionRound={currentQuestionRound}
              hints={currentQuestionRound.question.hints}
            />
          </div>
        )}
      </div>
      <div className="d-flex flex-row">
        {[
          {
            text: "Check",
            handleOnClick: () => {
              check(placeBet, game, playerId);
            },
          },
          {
            text: "Call",
            handleOnClick: () => {
              call(placeBet, game, playerId);
            },
          },
          {
            text: "Raise",
            handleOnClick: () => {
              raise(50, placeBet, game, playerId);
            },
          },
        ].map((actionButtonProps) => (
          <ActionButton key={actionButtonProps.text} {...actionButtonProps} />
        ))}
      </div>
    </div>
  );
}

export default GameComponent;
