import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useLazyQuery, useMutation } from "@apollo/react-hooks";
import {
  GET_GAME_BY_ID,
  CREATE_PLAYER,
  START_GAME,
  PLACE_BET,
  ADD_GUESS,
} from "../../api/queries";
import { Game, Player } from "../../interfaces";
import { getPlayerIdFromStorage, setPlayerIdToStorage } from "../../storage";
import PlayerTable from "./PlayerTable";
import Question from "./Question";
import Hints from "./Hints";
import Pot from "./Pot";
import ActionButtons from "./PlaceBetActionButtons";
import { getCurrentQuestionRound, getCurrentBettingRound } from "./helpers";

function GameComponent() {
  const [playerId, setPlayerId] = useState<string | undefined>(undefined);
  const [game, setGame] = useState<Game | undefined>(undefined);
  const { game_id: gameId } = useParams();

  const [
    fetchGame,
    { data: fetchGameData, error: fetchGameError },
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

  const [
    addGuess,
    { data: addGuessData, loading: addGuessLoading, error: addGuessError },
  ] = useMutation<{ addGuess: Game }>(ADD_GUESS);

  useEffect(() => {
    setInterval(() => {
      fetchGame({
        variables: { gameId },
      });
    }, 500);
  }, []);

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
    }

    setGame(
      fetchGameData?.game ||
        startGameData?.startGame ||
        placeBetData?.placeBet ||
        addGuessData?.addGuess
    );
  }, [
    gameId,
    playerId,
    newPlayerData,
    createPlayer,
    fetchGameData,
    startGameData,
    placeBetData,
  ]);

  if (!game || !playerId) {
    return <h3>Loading...</h3>;
  }

  if (
    fetchGameError ||
    addPlayerError ||
    startGameError ||
    placeBetError ||
    addGuessError
  ) {
    console.error(
      fetchGameError ||
        addPlayerError ||
        startGameError ||
        placeBetError ||
        addGuessError
    );
    return <p>A technical error occurred. Try to refresh the page</p>;
  }

  const currentQuestionRound = getCurrentQuestionRound(game);
  const currentBettingRound = getCurrentBettingRound(currentQuestionRound);
  return (
    <>
      {(addPlayerLoading ||
        startGameLoading ||
        placeBetLoading ||
        addGuessLoading) && <p>Loading...</p>}

      {!game.questionRounds.length && (
        <button
          className="btn btn-primary mx-3"
          onClick={() => {
            startGame({
              variables: { gameId },
            });
          }}
        >
          Start Game
        </button>
      )}

      <div className="d-flex flex-row mt-3">
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
            <Question
              {...{
                game,
                currentQuestionRound,
                playerId,
                addGuessMutation: addGuess,
              }}
            />
            <Hints
              currentQuestionRound={currentQuestionRound}
              hints={currentQuestionRound.question.hints}
            />
            <Pot
              playerId={playerId}
              currentQuestionRound={currentQuestionRound}
            />
          </div>
        )}
      </div>
      <div className="d-flex flex-row">
        <ActionButtons
          {...{
            game,
            currentQuestionRound,
            currentBettingRound,
            placeBet,
            playerId,
          }}
        />
      </div>
    </>
  );
}

export default GameComponent;
