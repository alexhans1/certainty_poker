import React from "react";
import { EmojiObjects } from "@material-ui/icons";
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
import { getCurrentPlayerAction } from "../helpers";

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

  const playerAction = getCurrentPlayerAction(
    player,
    bettingRoundSpending,
    currentBettingRound
  );

  const positionIndex = playerSeatingOrder.filter((i) => i <= numberOfPlayers)[
    index
  ];

  let playerMoney = player.money;
  if (isQuestionRoundOver && !isGameOver) {
    playerMoney += bettingRoundSpending;
  }

  return (
    <div
      className={`player player-${positionIndex} ${isTurnPlayerClass} ${isAppPlayerClass} ${isDeadClass}`}
    >
      <span
        className={`status text-gray-900 ${
          isQuestionRoundOver && changeInMoney && changeInMoney > 0
            ? "bg-green-500"
            : "bg-gray-400"
        }`}
      >
        <Status
          {...{
            isWinningPlayer,
            isTurnPlayer,
            changeInMoney,
            isQuestionRoundOver,
            isDead: player.isDead,
            hasFolded,
            allPlayersPlacedTheirGuess,
            playerHasPlacedTheirGuess: !!guess,
            playerAction,
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
        <div className="inner-info text-gray-800">
          {!isQuestionRoundOver && !!bettingRoundSpending && (
            <div className="flex items-center">
              <GrMoney className="mx-1" />
              <span>{bettingRoundSpending}</span>
            </div>
          )}
          {revealGuess && question?.type && guess?.guess && (
            <div className="flex items-center">
              <EmojiObjects className="mx-1" fontSize="inherit" />
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
