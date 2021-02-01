import React from "react";
import { MonetizationOn, EmojiObjects } from "@material-ui/icons";
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

interface Props {
  player: Player;
  currentBettingRound?: BettingRound;
  changeInMoney?: number;
  index: number;
  isTurnPlayer: boolean;
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

export default ({
  player,
  index,
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
}: Props) => {
  const isTurnPlayerClass =
    isTurnPlayer && !isQuestionRoundOver ? "isTurnPlayer" : "";
  const isAppPlayerClass = isAppPlayer ? "isAppPlayer" : "";
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

  return (
    <div
      className={`player player-${
        index + 1
      } ${isTurnPlayerClass} ${isAppPlayerClass} ${isDeadClass}`}
    >
      <span
        className={`status ${
          isQuestionRoundOver && changeInMoney && changeInMoney > 0
            ? "bg-success"
            : ""
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
          }}
        />
      </span>
      <div className="info">
        <span className="name">{player.name}</span>
        <div className="flex items-center">
          <MonetizationOn className="mr-1" fontSize="small" />
          <span>{player.money}</span>
          {isQuestionRoundOver && changeInMoney && (
            <span
              className={`ml-1 ${
                changeInMoney > 0 ? "text-green-500" : "text-red-500"
              }`}
            >
              ({changeInMoney})
            </span>
          )}
        </div>
        <div className="inner-info text-gray-800">
          {!isQuestionRoundOver && !!bettingRoundSpending && (
            <div className="flex items-center">
              <MonetizationOn className="mx-1" fontSize="inherit" />
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
