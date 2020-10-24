import React from "react";
import { QuestionRound } from "../../../interfaces";

const styles = {
  title: {
    borderTop: "1px solid #ebebeb",
    marginTop: "0.4em",
  },
  currentHint: {
    fontSize: "1.5em",
  },
  oldHint: {
    fontSize: "0.7em",
  },
};

interface HintsProps {
  currentQuestionRound: QuestionRound;
}

export default ({ currentQuestionRound }: HintsProps) => {
  const hints = currentQuestionRound.question.hints;
  const numberOfHints = currentQuestionRound.bettingRounds.length - 1;
  if (numberOfHints < 1) {
    return null;
  }
  if (!hints?.length) {
    return null;
  }
  return (
    <div className="d-flex flex-column">
      <span style={styles.title}>
        Hint{numberOfHints > 1 && "s"} ({numberOfHints}/{hints.length}):
      </span>
      {currentQuestionRound.question.hints
        .slice(0, currentQuestionRound.bettingRounds.length - 1)
        .map((hint, i) => (
          <span
            style={
              numberOfHints === i + 1 ? styles.currentHint : styles.oldHint
            }
          >
            {hint}
          </span>
        ))}
    </div>
  );
};
