import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  useLazyQuery,
  useMutation,
  useSubscription,
} from "@apollo/react-hooks";
import {
  GET_GAME_BY_ID,
  CREATE_PLAYER,
  START_GAME,
  PLACE_BET,
  ADD_GUESS,
  SUBSCRIBE_TO_GAME_BY_ID,
} from "../../api/queries";
import { Game, Player } from "../../interfaces";
import {
  getFingerprintFromStorage,
  getPlayerIdFromStorage,
  setFingerprintToStorage,
  setPlayerIdToStorage,
} from "../../storage";
import PlayerTable from "./PlayerTable";
import Question from "./Question";
import AnswerDrawer from "./AnswerDrawer";
import NameInputDrawer from "./NameInputDrawer";
import Footer from "./Footer";
import {
  getCurrentQuestionRound,
  getCurrentBettingRound,
  getPreviousQuestionRound,
} from "./helpers";

import "./styles.scss";
import errorLogger from "../../api/errorHandler";

function GameComponent() {
  const [playerId, setPlayerId] = useState<string | undefined>(undefined);
  const [game, setGame] = useState<Game | undefined>(undefined);
  const currentQuestionRound = getCurrentQuestionRound(game);
  const currentBettingRound = getCurrentBettingRound(currentQuestionRound);
  const [showNewQuestionRound, setShowNewQuestionRound] = useState(true);
  const { gameId } = useParams<{ gameId: string }>();
  const [gqlErr, setGqlErr] = useState<Error>();

  const errorHandler = (err: Error) => {
    errorLogger(err);
    setGqlErr(err);
  };

  const [fetchGame] = useLazyQuery<{ game: Game }>(GET_GAME_BY_ID, {
    fetchPolicy: "cache-and-network",
    onError: errorHandler,
    onCompleted: ({ game }) => {
      setGame(game);
    },
  });

  const [
    createPlayer,
    { data: newPlayerData, loading: addPlayerLoading },
  ] = useMutation<{ addPlayer: Player }>(CREATE_PLAYER, {
    onError: errorHandler,
  });

  const [startGame, { loading: startGameLoading }] = useMutation<{
    startGame: Game;
  }>(START_GAME, { onError: errorHandler });

  const [placeBet, { loading: placeBetLoading }] = useMutation<{
    placeBet: Game;
  }>(PLACE_BET, { onError: errorHandler });

  const [addGuess, { loading: addGuessLoading }] = useMutation<{
    addGuess: Game;
  }>(ADD_GUESS, { onError: errorHandler });

  const { error: subscriptionError } = useSubscription<{
    gameUpdated: Game;
  }>(SUBSCRIBE_TO_GAME_BY_ID, {
    variables: {
      gameId,
      hash:
        getFingerprintFromStorage(gameId) || setFingerprintToStorage(gameId),
    },
    onSubscriptionData: ({ subscriptionData }) => {
      setGame(subscriptionData.data?.gameUpdated);
    },
  });

  useEffect(() => {
    if (subscriptionError) {
      errorHandler(subscriptionError);
    }
  }, [subscriptionError]);

  useEffect(() => {
    fetchGame({
      variables: { gameId },
    });
  }, [fetchGame, gameId]);

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
    }
  }, [gameId, newPlayerData]);

  if (!game) {
    return <h3>Loading...</h3>;
  }

  if (gqlErr) {
    return <p>A technical error occurred. Try to refresh the page</p>;
  }

  const player = game.players.find((p) => p.id === playerId);
  const playerGuessInCurrentQuestionRound = currentQuestionRound?.guesses.find(
    (guess) => guess.playerId === playerId
  );
  const hasPlayerPlacedGuessInCurrentQuestionRound = !!playerGuessInCurrentQuestionRound;
  const previousQuestionRound =
    (!hasPlayerPlacedGuessInCurrentQuestionRound && !player?.isDead) ||
    (!((currentQuestionRound?.bettingRounds[0].bets.length || 0) > 2) &&
      player?.isDead)
      ? getPreviousQuestionRound(game)
      : undefined;

  return (
    <>
      {(addPlayerLoading ||
        startGameLoading ||
        placeBetLoading ||
        addGuessLoading) && <p>Loading...</p>}
      <div
        className="grid mt-3"
        style={{ fontWeight: 300, paddingBottom: "130px" }}
      >
        {currentQuestionRound && playerId && (
          <Question
            {...{
              game,
              usedQuestionRound: previousQuestionRound || currentQuestionRound,
              playerId,
            }}
          />
        )}
        <div className="d-flex flex-column">
          <PlayerTable
            {...{
              players: game?.players,
              playerId,
              usedQuestionRound: previousQuestionRound || currentQuestionRound,
              currentBettingRound,
              revealAnswers: game.isOver || !!previousQuestionRound,
              game,
            }}
          />
        </div>
        {!showNewQuestionRound &&
          !hasPlayerPlacedGuessInCurrentQuestionRound &&
          !player?.isDead && (
            <button
              className="new-question-button btn btn-primary mx-auto mt-5"
              onClick={() => {
                setShowNewQuestionRound(true);
              }}
            >
              Answer New Question
            </button>
          )}
      </div>
      {currentQuestionRound && playerId && (
        <AnswerDrawer
          {...{
            game,
            addGuessMutation: addGuess,
            currentQuestionRound,
            playerId,
            showNewQuestionRound,
            setShowNewQuestionRound,
          }}
        />
      )}
      {!game.isOver && (
        <Footer
          {...{
            game,
            currentQuestionRound,
            currentBettingRound,
            placeBet,
            playerId,
            startGame,
          }}
        />
      )}
      <NameInputDrawer {...{ gameId, createPlayer, playerId }} />
    </>
  );
}

export default GameComponent;
