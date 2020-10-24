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
};

export default ({ game, currentQuestionRound, playerId }: QuestionProps) => {
  // if the user has not yet placed a bet,
  // show the result of the previous round if their is one
  if (
    game.questionRounds.length > 1 &&
    !currentQuestionRound.guesses.find((guess) => guess.playerId === playerId)
  ) {
    const previousQuestionRound =
      game.questionRounds[game.questionRounds.length - 2];
    return (
      <>
        <p>{previousQuestionRound.question.question}</p>
        <p>Answer: {previousQuestionRound.question.answer}</p>
      </>
    );
  }
  const noHints = currentQuestionRound.bettingRounds.length <= 1;
  return (
    <span style={(noHints && styles.question) || {}}>
      {currentQuestionRound.question.question}
    </span>
  );
};
