import React from "react";
import { QuestionRound } from "../../../interfaces";

interface QuestionProps {
  currentQuestionRound: QuestionRound;
}

const styles = {
  question: {
    fontSize: "2em",
  },
};

export default ({ currentQuestionRound }: QuestionProps) => {
  // const [guess, setGuess] = useState(0);
  // const inputIsDisabled = !!currentQuestionRound.guesses.find(
  //   (guess) => guess.playerId === playerId
  // );
  const noHints = currentQuestionRound.bettingRounds.length <= 1;
  return noHints ? (
    <p style={styles.question}>{currentQuestionRound.question.question}</p>
  ) : (
    <span>{currentQuestionRound.question.question}</span>
  );
};
