import React from "react";
import { Game, QuestionRound, QuestionTypes } from "../../../interfaces";
import Guess from "../Guess";
import { getRevealAnswer } from "../helpers";
import Hints from "./Hints";

interface QuestionProps {
  game: Game;
  usedQuestionRound: QuestionRound;
}

const styles = {
  question: {
    fontSize: "1.6em",
  },
  answer: {
    fontSize: "1.6em",
  },
};

export default ({ game, usedQuestionRound }: QuestionProps) => {
  const noHints =
    usedQuestionRound.question.type !== QuestionTypes.MULTIPLE_CHOICE &&
    usedQuestionRound.bettingRounds.length <= 1 &&
    !usedQuestionRound.isOver;
  const totalQuestions = game.questionRounds.length + game.questions.length;
  return (
    <div>
      <p className="mb-0" style={(!noHints && { fontSize: "0.7em" }) || {}}>
        Question ({game.questionRounds.length}/{totalQuestions}):
      </p>
      <p style={(noHints && styles.question) || {}}>
        {usedQuestionRound.question.question}
      </p>
      <Hints
        {...{
          usedQuestionRound,
        }}
      />
      {[QuestionTypes.NUMERICAL, QuestionTypes.DATE].includes(
        usedQuestionRound.question.type
      ) &&
        getRevealAnswer(usedQuestionRound) && (
          <>
            <p style={styles.answer}>
              Answer:{" "}
              <b>
                <Guess
                  guess={usedQuestionRound.question.answer}
                  questionType={usedQuestionRound.question.type}
                />
              </b>
            </p>
            {usedQuestionRound.question.explanation && (
              <p>{usedQuestionRound.question.explanation}</p>
            )}
          </>
        )}
    </div>
  );
};
