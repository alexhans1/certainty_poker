import React from "react";
import { MonetizationOn } from "@material-ui/icons";
import { BettingRound, Player } from "../../../../interfaces";

import "./styles.scss";
import { calculateBettingRoundSpendingForPlayer } from "../../helpers";

interface Props {
  player: Player;
  currentBettingRound?: BettingRound;
  index: number;
  isTurnPlayer: boolean;
  isAppPlayer: boolean;
  isQuestionRoundOver: boolean;
}

export default ({
  player,
  index,
  isTurnPlayer,
  isAppPlayer,
  isQuestionRoundOver,
  currentBettingRound,
}: Props) => {
  const isTurnPlayerClass = isTurnPlayer ? "isTurnPlayer" : "";
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
      <span className="status" />
      <div className="info">
        <span className="name">{player.name}</span>
        <div className="d-flex align-items-center">
          <MonetizationOn className="mr-1" fontSize="small" />
          <span className="money">{player.money}</span>
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
