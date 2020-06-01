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
  if (currentQuestionRound.bettingRounds.length <= 1) {
    return null;
  }
  return (
    <>
      <p>Hints:</p>
      {currentQuestionRound.question.hints
        .slice(0, currentQuestionRound.bettingRounds.length - 1)
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
