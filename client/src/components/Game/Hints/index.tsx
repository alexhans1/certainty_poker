import React from "react";
import { Question, QuestionRound } from "../../../interfaces";

interface HintsProps {
  hints: Question["hints"];
  currentQuestionRound: QuestionRound;
}

export default ({ hints, currentQuestionRound }: HintsProps) => {
  if (!hints?.length) {
    return null;
  }
  if (currentQuestionRound.currentBettingRound === 0) {
    return null;
  }
  return (
    <>
      <p>Hints:</p>
      {currentQuestionRound.question.hints
        .slice(0, currentQuestionRound.currentBettingRound)
        .map((hint, i) => (
          <p>
            <b>
              {i + 1}. {hint}
            </b>
          </p>
        ))}
    </>
  );
};
