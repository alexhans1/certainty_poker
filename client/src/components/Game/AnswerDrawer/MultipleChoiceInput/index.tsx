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
        className="bg-blue-500 mr-auto rounded-lg font-bold text-white text-center px-4 py-3 transition duration-300 ease-in-out hover:bg-blue-600"
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
