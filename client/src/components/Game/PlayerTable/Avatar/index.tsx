import React from "react";
import { BettingRound, Player } from "../../../../interfaces";

import "./styles.scss";

export enum Size {
  lg = "lg",
  md = "md",
}

export interface Props {
  id: Player["id"];
  name: Player["name"];
  currentBettingRound?: BettingRound;
  isDead?: boolean;
  isFolded?: boolean;
  gameIsOver?: boolean;
  isDealer: boolean;
  showPreviousQuestionRoundResults: boolean;
  size: Size;
}

export default ({
  id,
  name,
  currentBettingRound,
  isDead,
  isFolded,
  gameIsOver,
  size,
  isDealer,
  showPreviousQuestionRoundResults,
}: Props) => {
  const isPlayerTurn =
    !showPreviousQuestionRoundResults &&
    !gameIsOver &&
    currentBettingRound?.currentPlayer.id === id;
  return (
    <div className={`avatar ${size} ${isDead || isFolded ? "dead" : ""}`}>
      <span className={isPlayerTurn ? "tada" : ""}>{name}</span>
      {isPlayerTurn && <span className="turn">{">"}</span>}
      {isDealer && <span className="dealer">{"D"}</span>}
    </div>
  );
};
