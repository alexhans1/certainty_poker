import React from "react";
import { QuestionRound } from "../../../interfaces";

interface HintsProps {
  currentQuestionRound: QuestionRound;
}

export default ({ currentQuestionRound }: HintsProps) => {
  const hints = currentQuestionRound.question.hints;
  if (currentQuestionRound.bettingRounds.length <= 1) {
    return null;
  }
  if (!hints?.length) {
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
