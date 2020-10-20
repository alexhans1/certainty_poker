import React from "react";
import { Player, QuestionRound } from "../../../interfaces";

interface PotProps {
  playerId: Player["id"];
  currentQuestionRound: QuestionRound;
}

export default ({ currentQuestionRound, playerId }: PotProps) => {
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
  return (
    <>
      <p>Pot:</p>
      <b>Total: {totalPot}</b>
      <br />
      <b>Your share: {playerPot}</b>
    </>
  );
};
