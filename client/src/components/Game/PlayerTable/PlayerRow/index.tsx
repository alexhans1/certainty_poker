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
  showPreviousQuestionRoundResults: boolean;
  size: Size;
  money: number;
}

export default ({
  id,
  name,
  currentBettingRound,
  isDead,
  isFolded,
  gameIsOver,
  size,
  showPreviousQuestionRoundResults,
  money,
}: Props) => {
  const isPlayerTurn =
    !showPreviousQuestionRoundResults &&
    !gameIsOver &&
    currentBettingRound?.currentPlayer.id === id;
  return (
    <div
      className={`d-flex flex-column align-items-center ${
        isPlayerTurn && size === Size.lg ? "tada" : ""
      }`}
    >
      <div className={`avatar ${isDead || isFolded ? "dead" : ""}`}>
        <span>{name}</span>
        <div className="d-flex">
          <span role="img" aria-label="money bag">
            💰
          </span>
          <span>{money}</span>
        </div>
        {isPlayerTurn && <span className="turn">{">"}</span>}
      </div>
    </div>
  );
};
