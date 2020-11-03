import React from "react";
import { Game, Player, QuestionRound } from "../../../interfaces";
import { getRevealAnswer } from "../helpers";

interface QuestionProps {
  game: Game;
  usedQuestionRound: QuestionRound;
  playerId: Player["id"];
}

const styles = {
  question: {
    fontSize: "2em",
  },
  title: {
    fontSize: "0.7em",
  },
  answer: {
    fontSize: "2em",
  },
};

export default ({ game, usedQuestionRound, playerId }: QuestionProps) => {
  const noHints = usedQuestionRound.bettingRounds.length <= 1;
  const totalQuestions = game.questionRounds.length + game.questions.length;
  return (
    <>
      <p className="mb-0" style={(!noHints && { fontSize: "0.6em" }) || {}}>
        Question ({game.questionRounds.length}/{totalQuestions}):
      </p>
      <p style={(noHints && styles.question) || {}}>
        {usedQuestionRound.question.question}
      </p>
      {getRevealAnswer(usedQuestionRound) && (
        <p style={styles.answer}>
          Answer: <b>{usedQuestionRound.question.answer}</b>
        </p>
      )}
    </>
  );
};
