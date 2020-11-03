import React from "react";
import { QuestionRound } from "../../../../interfaces";
import { getRevealAnswer } from "../../helpers";

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
  usedQuestionRound: QuestionRound;
}

export default ({ usedQuestionRound }: HintsProps) => {
  const hints = usedQuestionRound.question.hints;
  const numberOfHints = usedQuestionRound.isOver
    ? hints.length
    : Math.min(usedQuestionRound.bettingRounds.length - 1, hints.length);
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
      <ol>
        {usedQuestionRound.question.hints
          .slice(0, numberOfHints)
          .map((hint, i) => (
            <li
              key={hint}
              style={
                numberOfHints === i + 1 && !getRevealAnswer(usedQuestionRound)
                  ? styles.currentHint
                  : styles.oldHint
              }
            >
              {hint}
            </li>
          ))}
      </ol>
    </div>
  );
};
