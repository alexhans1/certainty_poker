import React from "react";
import { Game, QuestionRound } from "../../../interfaces";
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
    usedQuestionRound.bettingRounds.length <= 1 && !usedQuestionRound.isOver;
  const totalQuestions = game.questionRounds.length + game.questions.length;
  return (
    <div className="mb-4">
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
      {getRevealAnswer(usedQuestionRound) && (
        <>
          <p style={styles.answer}>
            Answer: <b>{usedQuestionRound.question.answer}</b>
          </p>
          {usedQuestionRound.question.explanation && (
            <p>{usedQuestionRound.question.explanation}</p>
          )}
        </>
      )}
    </div>
  );
};
