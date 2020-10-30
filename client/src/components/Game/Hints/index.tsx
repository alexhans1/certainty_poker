import React from "react";
import { QuestionRound } from "../../../interfaces";

const styles = {
  title: {
    fontSize: "0.8em",
    borderTop: "1px solid #ebebeb",
    marginTop: "0.3em",
    paddingTop: "1em",
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
  previousQuestionRound?: QuestionRound;
}

export default ({
  currentQuestionRound,
  previousQuestionRound,
}: HintsProps) => {
  const usedQuestionRound = previousQuestionRound
    ? previousQuestionRound
    : currentQuestionRound;
  const hints = usedQuestionRound.question.hints;
  const numberOfHints = usedQuestionRound.bettingRounds.length - 1;
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
      {usedQuestionRound.question.hints
        .slice(0, usedQuestionRound.bettingRounds.length - 1)
        .map((hint, i) => (
          <span
            key={hint}
            style={
              numberOfHints === i + 1 && !previousQuestionRound
                ? styles.currentHint
                : styles.oldHint
            }
          >
            {hint}
          </span>
        ))}
    </div>
  );
};
