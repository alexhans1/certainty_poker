import React, { useState } from "react";
import { QuestionRound } from "../../../../interfaces";
import MultipleChoiceOptions from "../../MultipleChoiceOptions";

interface Props {
  usedQuestionRound: QuestionRound;
  alternatives?: {
    value: string;
    active: boolean;
  }[];
  handleSubmit: (guess: number) => void;
}

export default ({ usedQuestionRound, handleSubmit, alternatives }: Props) => {
  const [guess, setGuess] = useState<number>();
  if (alternatives?.length !== 4) {
    throw new Error("missing alternatives for multiple choice question");
  }

  return (
    <>
      <MultipleChoiceOptions
        usedQuestionRound={usedQuestionRound}
        handleClick={setGuess}
        guess={guess}
      />
      <button
        className="btn btn-primary ml-auto"
        onClick={() => {
          if (guess || guess === 0) {
            handleSubmit(guess);
            setGuess(undefined);
          }
        }}
        disabled={!guess && guess !== 0}
      >
        Submit
      </button>
    </>
  );
};
