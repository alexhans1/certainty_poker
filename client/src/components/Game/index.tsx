import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useSound from "use-sound";
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
import LeaveGameButton from "./LeaveGameButton";
import GuessMap from "./GuessMap";
import MultipleChoiceOptions from "./MultipleChoiceOptions";
import {
  getCurrentQuestionRound,
  getCurrentBettingRound,
  getPreviousQuestionRound,
  haveAllPlayersPlacedTheirGuess,
} from "./helpers";
import errorLogger from "../../api/errorHandler";

import "./styles.scss";

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
  const [gqlErr, setGqlErr] = useState<Error>();
  const [playNotification] = useSound(
    require("../../assets/turn-notification.mp3")
  );
  const [playAlert] = useSound(require("../../assets/turn-alert.wav"));

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
        playNotification();
        vibrate(200);
        soundInterval = setInterval(() => {
          playAlert();
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
    <>
      <div
        className="grid mt-3"
        style={{ fontWeight: 300, paddingBottom: "130px" }}
      >
        <div>
          {usedQuestionRound && (
            <Question
              {...{
                game,
                usedQuestionRound,
                playerId,
              }}
            />
          )}
          <GuessMap
            {...{
              usedQuestionRound,
              isSpectator,
              playerId,
              players: game.players,
            }}
          />
          <MultipleChoiceOptions
            {...{
              usedQuestionRound,
              alternatives:
                usedQuestionRound?.question.alternatives?.map((alt) => ({
                  value: alt,
                  active: !usedQuestionRound.question.hiddenAlternatives?.includes(
                    alt
                  ),
                })) || [],
              guess: usedQuestionRound?.guesses.find(
                (g) => g.playerId === playerId
              )?.guess.numerical,
            }}
          />
        </div>
        <div className="d-flex flex-column">
          <PlayerTable
            {...{
              players: game?.players,
              playerId,
              usedQuestionRound,
              currentBettingRound,
              isSpectator,
              game,
            }}
          />
        </div>
        {isSpectator && usedQuestionRound?.isOver && (
          <button
            className="new-question-button btn btn-light mx-auto mt-5"
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
      {!game.isOver && !isSpectator && (
        <Footer
          {...{
            game,
            currentQuestionRound,
            currentBettingRound,
            placeBet,
            playerId,
            startGame,
            hasPlayerPlacedGuessInCurrentQuestionRound,
            setShowAnswerDrawer,
          }}
        />
      )}
      {!gameHasStarted && (
        <NameInputDrawer {...{ gameId, createPlayer, playerId }} />
      )}

      <LeaveGameButton {...{ gameId, playerId, gameHasStarted, setPlayerId }} />
    </>
  );
}

export default GameComponent;
