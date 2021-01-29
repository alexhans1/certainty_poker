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
  revealPreviousAnswers: boolean;
}

export default ({
  currentQuestionRound,
  currentBettingRound,
  playerId,
  revealPreviousAnswers,
}: PotProps) => {
  const [totalPot, playerPot] = revealPreviousAnswers
    ? [0, 0]
    : currentQuestionRound.bettingRounds.reduce(
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
  const amountToCall = revealPreviousAnswers
    ? 0
    : calculateAmountToCall(currentBettingRound, playerId);
  return (
    <div
      className="d-flex flex-row  justify-content-between pb-3 px-1"
      style={styles}
    >
      <span>
        Pot (total/you):{" "}
        <span role="img" aria-label="money">
          💰
        </span>
        {totalPot}/{playerPot}
      </span>
    </div>
  );
};
