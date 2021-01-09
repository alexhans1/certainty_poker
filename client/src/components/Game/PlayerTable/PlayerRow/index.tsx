import React from "react";
import { Player } from "../../../../interfaces";
import { GradientColor } from "../colors";

import "./styles.scss";

export interface Props {
  id: Player["id"];
  name: Player["name"];
  currentPlayerId?: Player["id"];
  isDead?: boolean;
  isFolded?: boolean;
  gameIsOver?: boolean;
  questionRoundIsOver?: boolean;
  hasWonGame?: boolean;
  showPreviousQuestionRoundResults: boolean;
  isAppPlayer: boolean;
  money: number;
  moneyChange?: number;
  rank?: number;
  gradientColor: GradientColor;
  guess?: JSX.Element | boolean;
}

export default ({
  id,
  name,
  currentPlayerId,
  isDead,
  isFolded,
  gameIsOver,
  questionRoundIsOver,
  isAppPlayer,
  showPreviousQuestionRoundResults,
  money,
  moneyChange,
  guess,
  hasWonGame,
  rank,
  gradientColor,
}: Props) => {
  const isPlayerTurn =
    !showPreviousQuestionRoundResults && !gameIsOver && currentPlayerId === id;
  return (
    <div
      className={`player-row ${isFolded || isDead ? "dead" : ""} ${
        isPlayerTurn && isAppPlayer ? "tada" : ""
      } ${isPlayerTurn && !questionRoundIsOver ? "turn border-danger" : ""}`}
      style={{
        color: gradientColor[2] ? "#393d4e" : "inherit",
        backgroundColor: gradientColor[0],
        background: `linear-gradient(to bottom right, ${gradientColor[0]}, ${gradientColor[1]})`,
      }}
    >
      <div className="turn-container">
        {isPlayerTurn && <span className="turn">{">"}</span>}
        {gameIsOver && <span className="rank">{rank}.</span>}
      </div>
      <div
        className="name-container"
        style={{ fontWeight: isAppPlayer ? "bold" : "unset" }}
      >
        {name}
      </div>
      {guess && (
        <div className="guess-container">
          <span>{guess}</span>
        </div>
      )}
      <div className="icon-container">
        {hasWonGame && (
          <span className="trophy" role="img" aria-label="trophy">
            🏆
          </span>
        )}
        {isDead && !gameIsOver && (
          <span className="skull" role="img" aria-label="skull">
            💀
          </span>
        )}
      </div>
      <div className="money-container">
        <div className="d-flex">
          <span role="img" aria-label="money bag">
            💰
          </span>
          <span>{money}</span>
          {!!moneyChange && moneyChange !== 0 && (
            <span
              className={`ml-2 ${
                questionRoundIsOver &&
                (moneyChange > 0 ? "text-success" : "text-danger")
              }`}
            >
              {" "}
              <b>{moneyChange}</b>
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
