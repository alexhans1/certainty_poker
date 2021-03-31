import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  useLazyQuery,
  useMutation,
  useSubscription,
} from "@apollo/react-hooks";
import { AiFillFileUnknown } from "react-icons/ai";
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
import PreGameLobby from "./PreGameLobby";
import PokerTable from "./PokerTable";
import AnswerDrawer from "./AnswerDrawer";
import Footer from "./Footer";
import LeaveGameButton from "./LeaveGameButton";
import ErrorBoundary from "../ErrorBoundary";
import {
  getCurrentQuestionRound,
  getCurrentBettingRound,
  getPreviousQuestionRound,
  haveAllPlayersPlacedTheirGuess,
} from "./helpers";
// @ts-ignore
import notificationSound from "../../assets/turn-notification.mp3";
// @ts-ignore
import alertSound from "../../assets/turn-alert.wav";

import "./styles.css";

const vibrate = (t: number) => {
  window.navigator.vibrate && window.navigator.vibrate(t);
};
let soundInterval: NodeJS.Timeout;

function GameComponent() {
  const [playerId, setPlayerId] = useState<string | undefined>(undefined);
  const [game, setGame] = useState<Game | undefined>(undefined);
  const currentQuestionRound = getCurrentQuestionRound(game);
  const currentBettingRound = getCurrentBettingRound(currentQuestionRound);
  const [showAnswerDrawer, setShowAnswerDrawer] = useState(false);
  const [
    showNewQuestionRoundForSpectator,
    setShowNewQuestionRoundForSpectator,
  ] = useState(false);
  const { gameId } = useParams<{ gameId: string }>();
  const [_, setError] = useState();

  const [playNotification] = useState(new Audio(notificationSound));
  const [playAlert] = useState(new Audio(alertSound));

  const errorHandler = (err: Error) => {
    setError(() => {
      throw err;
    });
  };

  const [fetchGame, { loading }] = useLazyQuery<{ game: Game }>(
    GET_GAME_BY_ID,
    {
      fetchPolicy: "cache-and-network",
      onError: errorHandler,
      onCompleted: ({ game }) => {
        setGame(game);
      },
    }
  );

  const [createPlayer, { data: newPlayerData }] = useMutation<{
    addPlayer: Player;
  }>(CREATE_PLAYER, {
    onError: errorHandler,
  });

  const [startGame] = useMutation<{
    startGame: Game;
  }>(START_GAME, { onError: errorHandler });

  const [placeBet] = useMutation<{
    placeBet: Game;
  }>(PLACE_BET, { onError: errorHandler });

  const [addGuess] = useMutation<{
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
      clearInterval(soundInterval);
      const game = subscriptionData.data?.gameUpdated;
      setGame(game);
      const cqr = getCurrentQuestionRound(game);
      const cbr = getCurrentBettingRound(cqr);
      const players = subscriptionData.data?.gameUpdated.players;
      const allPlayersPlacedTheirBet =
        cqr && players && haveAllPlayersPlacedTheirGuess(cqr, players);
      if (allPlayersPlacedTheirBet) {
        setShowNewQuestionRoundForSpectator(false);
      }
      if (
        !game?.isOver &&
        cbr?.currentPlayer.id === playerId &&
        allPlayersPlacedTheirBet
      ) {
        playNotification.play();
        vibrate(200);
        soundInterval = setInterval(() => {
          playAlert.play();
          vibrate(200);
        }, 15000);
      }
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

  if (loading) {
    return <h3 className="text-lg mt-6 font-semibold">Loading...</h3>;
  }

  if (!game) {
    return (
      <p className="text-lg mt-6 flex items-center font-semibold">
        <AiFillFileUnknown className="text-4xl mr-2" /> Game not found.
      </p>
    );
  }

  const player = game.players.find((p) => p.id === playerId);
  const playerGuessInCurrentQuestionRound = currentQuestionRound?.guesses.find(
    (guess) => guess.playerId === playerId
  );
  const hasPlayerPlacedGuessInCurrentQuestionRound = !!playerGuessInCurrentQuestionRound;
  const gameHasStarted = !!game.questionRounds.length;
  const isSpectator = gameHasStarted && (!player || player.isDead);
  const previousQuestionRound = getPreviousQuestionRound(game);
  const showPreviousQuestionRoundResults =
    !!previousQuestionRound &&
    (game.isOver ||
      (!hasPlayerPlacedGuessInCurrentQuestionRound && !isSpectator) ||
      (isSpectator &&
        !!currentQuestionRound &&
        !showNewQuestionRoundForSpectator &&
        !haveAllPlayersPlacedTheirGuess(currentQuestionRound, game.players)));
  const usedQuestionRound = showPreviousQuestionRoundResults
    ? previousQuestionRound
    : currentQuestionRound;

  return (
    <div
      className={`p-2 flex flex-col md:justify-center ${
        isSpectator || !gameHasStarted
          ? "min-h-screen"
          : "min-h-screen-minus-52 mb-52"
      }`}
    >
      <div className="flex flex-col md:my-auto">
        {!gameHasStarted && (
          <PreGameLobby
            players={game.players}
            gameLink={window.location.href}
            startGame={startGame}
            gameId={game.id}
            createPlayer={createPlayer}
            playerId={playerId}
            setNames={game.setNames}
          />
        )}
        {gameHasStarted && usedQuestionRound && (
          <PokerTable
            {...{
              game,
              usedQuestionRound,
              currentBettingRound,
              playerId,
              isSpectator,
            }}
          />
        )}
        {isSpectator && usedQuestionRound?.isOver && !game.isOver && (
          <button
            className="bg-blue-500 rounded-lg font-bold text-white text-center px-4 py-3 transition duration-300 ease-in-out hover:bg-blue-600 mx-auto mt-5"
            onClick={() => {
              setShowNewQuestionRoundForSpectator(true);
            }}
          >
            Show Next Question
          </button>
        )}
      </div>
      {currentQuestionRound && playerId && (
        <AnswerDrawer
          {...{
            game,
            addGuessMutation: addGuess,
            currentQuestionRound,
            player,
            showAnswerDrawer,
            setShowAnswerDrawer,
            hasPlayerPlacedGuessInCurrentQuestionRound,
          }}
        />
      )}
      {!game.isOver && player && !isSpectator && usedQuestionRound && (
        <Footer
          {...{
            game,
            usedQuestionRound,
            placeBet,
            player,
            startGame,
            hasPlayerPlacedGuessInCurrentQuestionRound,
            setShowAnswerDrawer,
            currentBettingRound,
          }}
        />
      )}

      <LeaveGameButton {...{ gameId, playerId, gameHasStarted, setPlayerId }} />
    </div>
  );
}

function GameWithErrorBoundary() {
  return (
    <ErrorBoundary>
      <GameComponent />
    </ErrorBoundary>
  );
}

export default GameWithErrorBoundary;
