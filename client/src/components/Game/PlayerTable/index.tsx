import React from "react";
import { isPlayerDead } from "../helpers";
import { Player, BettingRound, QuestionRound } from "../../../interfaces";

import "./styles.scss";

interface PlayerTableProps {
  players?: Player[];
  playerId?: Player["id"];
  currentBettingRound?: BettingRound;
  currentQuestionRound?: QuestionRound;
}

const moveAppPlayerToTop = (players: Player[], playerId: Player["id"]) =>
  players.splice(
    0,
    0,
    players.splice(
      players.findIndex(({ id }) => id === playerId),
      1
    )[0]
  );

export default ({
  players,
  playerId,
  currentBettingRound,
  currentQuestionRound,
}: PlayerTableProps) => {
  if (!players?.length || !playerId) {
    return null;
  }
  moveAppPlayerToTop(players, playerId);

  return (
    <div>
      {(players || []).map(({ id, money }) => {
        const isDead =
          currentQuestionRound &&
          isPlayerDead(currentQuestionRound, { id, money });
        return (
          <div key={id} className="d-flex align-items-center pt-4 ml-4">
            <div
              className={`avatar ${id === playerId ? "lg" : "md"} ${
                isDead ? "dead" : ""
              }`}
            >
              <span>🧟‍♂️</span>
              {currentBettingRound?.currentPlayer.id === id && (
                <span className="dice" role="img" aria-label="dice">
                  🎲
                </span>
              )}
            </div>
            <div>
              {id === playerId ? (
                <div
                  className={`money ${id === playerId ? "" : "md"} ${
                    isDead ? "dead" : ""
                  }`}
                >
                  <span>300km</span>
                  <span role="img" aria-label="money">
                    💰{money}
                  </span>
                </div>
              ) : (
                <div
                  className={`money ${id === playerId ? "" : "md"} ${
                    isDead ? "dead" : ""
                  }`}
                >
                  <span role="img" aria-label="money">
                    💰{money}
                  </span>
                </div>
              )}
            </div>
            {isDead && (
              <span className="skull" role="img" aria-label="skull">
                💀
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
};
