import React from "react";
import { FaRegLightbulb } from "react-icons/fa";
import { GrMoney } from "react-icons/gr";
import Status from "./Status";
import {
  BettingRound,
  Guess,
  Player,
  Question,
  QuestionTypes,
} from "../../../../interfaces";
import { calculateBettingRoundSpendingForPlayer } from "../../helpers";
import FormattedGuess from "../../Guess";

import "./styles.css";

const playerSeatingOrder = [1, 9, 5, 2, 11, 4, 8, 10, 6, 3, 12, 7];

interface Props {
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
  allPlayersPlacedTheirGuess?: boolean;
  guess?: Guess;
  question?: Question;
}

const PlayerComp = ({
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
}: Props) => {
  const isTurnPlayerClass =
    isTurnPlayer && !isQuestionRoundOver ? "isTurnPlayer" : "";
  const isAppPlayerClass = isAppPlayer ? "bg-blue-200" : "bg-gray-200";
  const isDeadClass = player.isDead ? "is-dead" : "";

  const bettingRoundSpending = currentBettingRound
    ? calculateBettingRoundSpendingForPlayer(currentBettingRound, player.id)
    : 0;
  const revealGuess =
    question?.type !== QuestionTypes.GEO &&
    (isSpectator || (!!isQuestionRoundOver && isShowdown && !hasFolded));

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
          {revealGuess && question?.type && guess?.guess && (
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
        </div>
      </div>
    </div>
  );
};

export default PlayerComp;
