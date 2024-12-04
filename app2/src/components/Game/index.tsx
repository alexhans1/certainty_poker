import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { AiFillFileUnknown } from "react-icons/ai";
import { Game, Guess, Player } from "../../interfaces";
import { getPlayerIdFromStorage, setPlayerIdToStorage } from "../../storage.ts";
import PreGameLobby from "./PreGameLobby";
import PokerTable from "./PokerTable";
import AnswerDrawer from "./AnswerDrawer";
import Footer from "./Footer";
import LeaveGameButton from "./LeaveGameButton";
import ErrorFallback from "../ErrorBoundary";
import {
  getCurrentQuestionRound,
  getCurrentBettingRound,
  getPreviousQuestionRound,
  haveAllPlayersPlacedTheirGuess,
  shufflePlayersInGame,
  addQuestionRound,
} from "./helpers";
// @ts-ignore
import notificationSound from "../../assets/turn-notification.mp3";
// @ts-ignore
import alertSound from "../../assets/turn-alert.wav";

import "./styles.css";
import { withErrorBoundary } from "react-error-boundary";
import { arrayUnion, doc, onSnapshot, updateDoc } from "firebase/firestore";
import db from "../../db/firestore-config";
import { v4 } from "uuid";

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
  if (!gameId) {
    throw new Error("gameId is required");
  }
  const [_, setError] = useState<Error>();

  const [playNotification] = useState(new Audio(notificationSound));
  const [playAlert] = useState(new Audio(alertSound));

  useEffect(() => {
    const unsubscribe = onSnapshot(
      doc(db, "games", gameId),
      (docSnapshot) => {
        if (docSnapshot.exists()) {
          setGame({ ...docSnapshot.data(), id: gameId } as Game);
        } else {
          console.log("Game does not exist.");
        }
      },
      (error) => {
        errorHandler(error);
      }
    );

    // Cleanup subscription on component unmount
    return () => {
      unsubscribe();
    };
  }, [gameId]);

  const errorHandler = (err: Error) => {
    setError(() => {
      throw err;
    });
  };

  useEffect(() => {
    if (gameId) {
      const storedPlayerId = getPlayerIdFromStorage(gameId);

      if (storedPlayerId) {
        setPlayerId(storedPlayerId);
      }
    }
  }, [gameId]);

  // todo: add loading state
  const loading = false;

  const createPlayer = async (gameId: string, playerName: string) => {
    const player: Player = {
      id: v4(),
      name: playerName,
      money: 100,
      isDead: false,
    };

    try {
      // Add the player to the players array
      await updateDoc(doc(db, "games", gameId), {
        players: arrayUnion(player),
      });
      setPlayerIdToStorage(gameId, player.id);
      setPlayerId(player.id);
    } catch (error) {
      console.error("error", error);
      errorHandler(error as unknown as Error);
    }
  };
  const startGame = async () => {
    if (!game) throw new Error("Game not found");
    if (game.questionRounds.length) throw new Error("Game already started");
    if (game.players.length < 2) throw new Error("Not enough players");

    await shufflePlayersInGame(game.id, game.players);
    await addQuestionRound(game);
  };

  const placeBet = () => {};

  const addGuess = async (gameId: string, guess: Guess) => {
    if (!game) throw new Error("Game not found");
    if (!currentQuestionRound) throw new Error("No current question round");

    const updatedQuestionRound = {
      ...currentQuestionRound,
      guesses: [...currentQuestionRound.guesses, guess],
    };

    const updatedQuestionRounds = [...game.questionRounds];
    updatedQuestionRounds[updatedQuestionRounds.length - 1] =
      updatedQuestionRound;

    try {
      await updateDoc(doc(db, "games", gameId), {
        questionRounds: updatedQuestionRounds,
      });
    } catch (error) {
      console.error("error", error);
      errorHandler(error as unknown as Error);
    }
  };

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
  const hasPlayerPlacedGuessInCurrentQuestionRound =
    !!playerGuessInCurrentQuestionRound;
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
            addGuess,
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

export default withErrorBoundary(GameComponent, {
  onError: (error) => {
    console.error("Uncaught error:", error);
  },
  FallbackComponent: ErrorFallback,
});
