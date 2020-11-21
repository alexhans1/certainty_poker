import React, { useState } from "react";

interface Props {
  handleSubmit: (guess: number | string) => void;
}

export default ({ handleSubmit }: Props) => {
  const [guess, setGuess] = useState<number | string>("");

  return (
    <div className="input-group mb-3">
      <input
        value={guess}
        onChange={(e) => {
          const value = parseFloat(e.target.value);
          if (value === 0) setGuess(0);
          else setGuess(value || e.target.value);
        }}
        onKeyUp={(e) => {
          if (e.which === 13) {
            handleSubmit(guess);
            setGuess("");
          }
        }}
        type="number"
        className="form-control form-control-lg"
        placeholder="Your answer"
        aria-label="Your answer"
        aria-describedby="basic-addon2"
        autoFocus
      />
      <div className="input-group-append">
        <button
          type="submit"
          className="btn btn-primary"
          disabled={typeof guess === "string" || (!guess && guess !== 0)}
          onClick={() => {
            handleSubmit(guess);
            setGuess("");
          }}
        >
          ⮑
        </button>
      </div>
    </div>
  );
};
