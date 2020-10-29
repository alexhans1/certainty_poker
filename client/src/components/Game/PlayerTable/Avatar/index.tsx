import React from "react";
import { BettingRound, Player } from "../../../../interfaces";

import "./styles.scss";

export enum Size {
  lg = "lg",
  md = "md",
}

export interface PlayerTableProps {
  id: Player["id"];
  name: Player["name"];
  currentBettingRound?: BettingRound;
  isDead?: boolean;
  isFolded?: boolean;
  gameIsOver?: boolean;
  isDealer: boolean;
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
}: PlayerTableProps) => {
  return (
    <div className={`avatar ${size} ${isDead || isFolded ? "dead" : ""}`}>
      <span>{name}</span>
      {!gameIsOver && currentBettingRound?.currentPlayer.id === id && (
        <span className="turn">{">"}</span>
      )}
      {isDealer && <span className="dealer">{"D"}</span>}
    </div>
  );
};
