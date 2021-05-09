import React from "react";
import { FaRegLightbulb } from "react-icons/fa";
import { GrMoney } from "react-icons/gr";
import Status from "./Status";
import {
  BettingRound,
  Game,
  Guess,
  Player,
  Question,
  QuestionTypes,
} from "../../../../interfaces";
import { calculateBettingRoundSpendingForPlayer } from "../../helpers";
import FormattedGuess from "../../Guess";
import RevealGuessButton from "./RevealGuessButton";

import "./styles.css";

const playerSeatingOrder = [1, 9, 5, 2, 11, 4, 8, 10, 6, 3, 12, 7];

interface Props {
  gameId: Game["id"];
  player: Player;
  numberOfPlayers: number;
  currentBettingRound?: BettingRound;
  changeInMoney?: number;
  index: number;
  isTurnPlayer: boolean;
  isGameOver: boolean;
  isAppPlayer: boolean;
  isWinningPlayer?: boolean;
  isQuestionRoundOver: boolean;
  isShowdown: boolean;
  hasFolded: boolean;
  isSpectator: boolean;
  isRevealingGuess: boolean;
  allPlayersPlacedTheirGuess?: boolean;
  guess?: Guess;
  question?: Question;
}

const PlayerComp = ({
  gameId,
  player,
  index,
  numberOfPlayers,
  isTurnPlayer,
  isAppPlayer,
  isWinningPlayer,
  isQuestionRoundOver,
  isShowdown,
  currentBettingRound,
  changeInMoney,
  hasFolded,
  isSpectator,
  allPlayersPlacedTheirGuess,
  guess,
  question,
  isGameOver,
  isRevealingGuess,
}: Props) => {
  const isTurnPlayerClass =
    isTurnPlayer && !isQuestionRoundOver ? "isTurnPlayer" : "";
  const isAppPlayerClass = isAppPlayer ? "bg-blue-200" : "bg-gray-200";
  const isDeadClass = player.isDead ? "is-dead" : "";

  const bettingRoundSpending = currentBettingRound
    ? calculateBettingRoundSpendingForPlayer(currentBettingRound, player.id)
    : 0;

  const isGeoQuestion = question?.type === QuestionTypes.GEO;
  const showGuess =
    isSpectator ||
    isRevealingGuess ||
    (isQuestionRoundOver && isShowdown && !hasFolded);
  const shouldRevealGuess = !isGeoQuestion && showGuess;
  const canRevealGuess = !showGuess && isQuestionRoundOver && isAppPlayer;

  const positionIndex = playerSeatingOrder.filter((i) => i <= numberOfPlayers)[
    index
  ];

  let playerMoney = player.money;
  if (isQuestionRoundOver && !isGameOver) {
    playerMoney += bettingRoundSpending;
  }

  return (
    <div
      className={`player player-${positionIndex} shadow-md ${isTurnPlayerClass} ${isAppPlayerClass} ${isDeadClass} md:absolute`}
    >
      <span
        className={`status text-gray-900 shadow-lg ${
          isQuestionRoundOver && changeInMoney && changeInMoney > 0
            ? "bg-green-500"
            : "bg-gray-400"
        }`}
      >
        <Status
          {...{
            player,
            isWinningPlayer,
            isTurnPlayer,
            changeInMoney,
            isQuestionRoundOver,
            isDead: player.isDead,
            hasFolded,
            allPlayersPlacedTheirGuess,
            playerHasPlacedTheirGuess: !!guess,
            playerIsAllIn: !player.isDead && player.money === 0,
          }}
        />
      </span>
      <div className="info">
        <span className="name">{player.name}</span>
        <div className="flex items-center">
          <GrMoney className="mr-1" />
          <span>{playerMoney}</span>
          {isQuestionRoundOver && changeInMoney && (
            <span
              className={`ml-1 ${
                changeInMoney > 0 ? "text-green-500" : "text-red-500"
              }`}
            >
              ({changeInMoney > 0 ? "+" : ""}
              {changeInMoney})
            </span>
          )}
        </div>
        <div className="inner-info grid absolute text-sm left-48 md:left-auto sm:-right-3 md:right-0 md:text-lg md:grid-flow-auto text-gray-800 md:w-full">
          {!isQuestionRoundOver && !!bettingRoundSpending && (
            <div className="flex items-center">
              <span className="mx-1">
                <GrMoney />
              </span>
              <span>{bettingRoundSpending}</span>
            </div>
          )}
          {shouldRevealGuess && question?.type && guess?.guess && (
            <div className="flex items-center">
              <span className="mx-1">
                <FaRegLightbulb />
              </span>
              <FormattedGuess
                {...{
                  guess: guess?.guess,
                  questionType: question.type,
                  alternatives: question.alternatives,
                }}
              />
            </div>
          )}
          {canRevealGuess && (
            <div>
              <RevealGuessButton gameId={gameId} playerId={player.id} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlayerComp;
