import React, { useState } from "react";

interface Props {
  handleSubmit: (guess: number | string) => void;
}

export default ({ handleSubmit }: Props) => {
  const [guess, setGuess] = useState<number | string>("");

  return (
    <div className="grid grid-cols-2 gap-4">
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
        className="bg-white border border-gray-400 px-4"
        placeholder="Your answer"
        aria-label="Your answer"
        aria-describedby="basic-addon2"
        autoFocus
      />
      <button
        type="submit"
        className="bg-blue-500 mr-auto rounded-lg font-bold text-white text-center px-4 py-3 transition duration-300 ease-in-out hover:bg-blue-600"
        disabled={typeof guess === "string" || (!guess && guess !== 0)}
        onClick={() => {
          handleSubmit(guess);
          setGuess("");
        }}
      >
        Submit
      </button>
    </div>
  );
};
