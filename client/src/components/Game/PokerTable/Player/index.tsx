import React from "react";
import {
  MonetizationOn,
  SentimentDissatisfied,
  SentimentVerySatisfied,
} from "@material-ui/icons";
import { BettingRound, Player } from "../../../../interfaces";

import "./styles.scss";
import { calculateBettingRoundSpendingForPlayer } from "../../helpers";
import { spawn } from "child_process";

interface Props {
  player: Player;
  currentBettingRound?: BettingRound;
  changeInMoney?: number;
  index: number;
  isTurnPlayer: boolean;
  isAppPlayer: boolean;
  isWinningPlayer?: boolean;
  isQuestionRoundOver: boolean;
}

export default ({
  player,
  index,
  isTurnPlayer,
  isAppPlayer,
  isWinningPlayer,
  isQuestionRoundOver,
  currentBettingRound,
  changeInMoney,
}: Props) => {
  const isTurnPlayerClass =
    isTurnPlayer && !isQuestionRoundOver ? "isTurnPlayer" : "";
  const isAppPlayerClass = isAppPlayer ? "isAppPlayer" : "";

  const bettingRoundSpending = currentBettingRound
    ? calculateBettingRoundSpendingForPlayer(currentBettingRound, player.id)
    : 0;
  return (
    <div
      className={`player player-${
        index + 1
      } ${isTurnPlayerClass} ${isAppPlayerClass}`}
    >
      <span className="status">
        {isWinningPlayer && isQuestionRoundOver && (
          <SentimentVerySatisfied fontSize="large" />
        )}
        {isQuestionRoundOver && changeInMoney && changeInMoney > 0 && (
          <SentimentVerySatisfied fontSize="large" />
        )}
        {isQuestionRoundOver && changeInMoney && changeInMoney < 0 && (
          <SentimentDissatisfied fontSize="large" />
        )}
      </span>
      <div className="info">
        <span className="name">{player.name}</span>
        <div className="d-flex align-items-center">
          <MonetizationOn className="mr-1" fontSize="small" />
          <span className="money">{player.money}</span>
          {isQuestionRoundOver && changeInMoney && (
            <span
              className={`ml-1 ${
                changeInMoney > 0 ? "text-success" : "text-danger"
              }`}
            >
              ({changeInMoney})
            </span>
          )}
        </div>
        {!isQuestionRoundOver && !!bettingRoundSpending && (
          <div className="spending">
            <MonetizationOn className="mr-1" fontSize="inherit" />
            <span>{bettingRoundSpending}</span>
          </div>
        )}
      </div>
    </div>
  );
};
