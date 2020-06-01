import React from "react";
import { calculateBettingRoundSpendingForPlayer } from "../helpers";
import { Player, BettingRound } from "../../../interfaces";

interface PlayerTableProps {
  players?: Player[];
  playerId?: Player["id"];
  currentBettingRound?: BettingRound;
}

export default ({
  players,
  playerId,
  currentBettingRound,
}: PlayerTableProps) => {
  if (!players?.length) {
    return null;
  }
  return (
    <div>
      <p>Players:</p>
      {(players || []).map(({ id, money }, i) => (
        <div className="ml-3" key={id}>
          {i !== 0 && <hr />}
          <div>
            {id === playerId && <span>👩‍💻</span>}Name: {id}
            {currentBettingRound?.currentPlayer.id === id && <span>❗️</span>}
          </div>
          <div>Remaining money: {money}</div>
          {currentBettingRound && (
            <div>
              Amount bet:{" "}
              {calculateBettingRoundSpendingForPlayer(currentBettingRound, id)}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
