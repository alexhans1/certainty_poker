import { QuestionRound } from "../../../../interfaces";
import { getRevealAnswer } from "../../helpers";

const styles = {
  title: {
    fontSize: "0.7em",
    borderTop: "1px solid #ebebeb",
    marginTop: "0.3em",
    paddingTop: "1em",
  },
  currentHint: {
    fontSize: "1.4em",
  },
  oldHint: {
    fontSize: "0.7em",
  },
};

interface Props {
  usedQuestionRound: QuestionRound;
}

export default function Hints({ usedQuestionRound }: Props) {
  const hints = usedQuestionRound.question.hints;

  if (!hints?.length) return null;

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
    <div className="flex flex-col">
      <span style={styles.title}>
        Hint{numberOfHints > 1 && "s"} ({numberOfHints}/{hints.length}):
      </span>
      <ol>
        {hints.slice(0, numberOfHints).map((hint, i) => (
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
}
