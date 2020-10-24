import React from "react";
import { BettingRound, Player, QuestionRound } from "../../../interfaces";
import { calculateAmountToCall } from "../helpers";

const styles = {
  fontSize: "0.9em",
};

interface PotProps {
  playerId: Player["id"];
  currentQuestionRound: QuestionRound;
  currentBettingRound: BettingRound;
}

export default ({
  currentQuestionRound,
  currentBettingRound,
  playerId,
}: PotProps) => {
  const [totalPot, playerPot] = currentQuestionRound.bettingRounds.reduce(
    ([total, playerShare], br) => {
      br.bets.forEach((bet) => {
        total += bet.amount;
        if (bet.playerId === playerId) {
          playerShare += bet.amount;
        }
      });
      return [total, playerShare];
    },
    [0, 0]
  );
  const amountToCall = calculateAmountToCall(currentBettingRound, playerId);
  return (
    <div
      className="d-flex w-100 flex-row  justify-content-between pb-3 px-1"
      style={styles}
    >
      <span>
        Pot (total/you):{" "}
        <span role="img" aria-label="money">
          💰
        </span>
        {totalPot}/{playerPot}
      </span>
      <span>
        To call:{" "}
        <span role="img" aria-label="money">
          💰
        </span>
        {amountToCall}
      </span>
    </div>
  );
};
