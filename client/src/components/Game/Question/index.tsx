import React from "react";
import { Game, Player, QuestionRound } from "../../../interfaces";

interface QuestionProps {
  game: Game;
  currentQuestionRound: QuestionRound;
  playerId: Player["id"];
}

const styles = {
  question: {
    fontSize: "2em",
  },
  title: {
    fontSize: "0.7em",
  },
};

export default ({ game, currentQuestionRound, playerId }: QuestionProps) => {
  // if the user has not yet placed a bet,
  // show the result of the previous round if their is one
  if (
    game.isOver ||
    (game.questionRounds.length > 1 &&
      !currentQuestionRound.guesses.find(
        (guess) => guess.playerId === playerId
      ))
  ) {
    const previousQuestionRound =
      game.questionRounds[game.questionRounds.length - (game.isOver ? 1 : 2)];
    return (
      <>
        <p>{previousQuestionRound.question.question}</p>
        <p>
          Answer: <b>{previousQuestionRound.question.answer}</b>
        </p>
      </>
    );
  }

  const noHints = currentQuestionRound.bettingRounds.length <= 1;
  const totalQuestions = game.questionRounds.length + game.questions.length;
  return (
    <>
      <p className="mb-0" style={(!noHints && { fontSize: "0.6em" }) || {}}>
        Question ({game.questionRounds.length}/{totalQuestions}):
      </p>
      <span style={(noHints && styles.question) || {}}>
        {currentQuestionRound.question.question}
      </span>
    </>
  );
};
