import React, { useState } from "react";
import { Question } from "../../../../interfaces";

import "./index.scss";

interface Props {
  alternatives: Question["alternatives"];
  handleSubmit: (guess: number) => void;
}

export default ({ handleSubmit, alternatives }: Props) => {
  const [guess, setGuess] = useState<number>();
  if (alternatives?.length !== 4) {
    throw new Error("missing alternatives for multiple choice question");
  }

  return (
    <>
      <div className="mc-container mb-3">
        {alternatives.map((alt, i) => (
          <button
            key={`${alt}_${i}`}
            className={`btn btn-outline-dark ${
              guess === i ? "bg-dark text-light shadow" : ""
            }`}
            onClick={() => setGuess(i)}
          >
            {alt}
          </button>
        ))}
      </div>
      <button
        className="btn btn-primary ml-auto"
        onClick={() => {
          (guess || guess === 0) && handleSubmit(guess);
        }}
        disabled={!guess && guess !== 0}
      >
        Submit
      </button>
    </>
  );
};
