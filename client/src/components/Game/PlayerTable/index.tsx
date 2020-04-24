import React from "react";
import { calculateBettingRoundSpendingForPlayer } from "../helpers";
import { Player, QuestionRound, BettingRound } from "../../../interfaces";

interface PlayerTableProps {
  players?: Player[];
  playerId?: Player["id"];
  currentQuestionRound?: QuestionRound;
  currentBettingRound?: BettingRound;
}

export default ({
  players,
  playerId,
  currentQuestionRound,
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
            {currentBettingRound?.currentPlayerId === id && <span>❗️</span>}
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
