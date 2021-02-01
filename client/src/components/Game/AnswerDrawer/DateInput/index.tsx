import React, { useState } from "react";

interface Props {
  handleSubmit: (guess: number) => void;
}

export default ({ handleSubmit }: Props) => {
  const [guess, setGuess] = useState<string>();

  const submit = (stringValue?: string) => {
    if (stringValue) {
      const value = parseInt(stringValue.replaceAll("-", ""));
      if (value) {
        handleSubmit(value);
        setGuess(undefined);
      }
    }
  };

  return (
    <div className="input-group mb-3">
      <input
        value={guess}
        onChange={(e) => {
          setGuess(e.target.value);
        }}
        onKeyUp={(e) => {
          if (e.which === 13) {
            submit(guess);
          }
        }}
        type="date"
        className="form-control form-control-lg"
        placeholder="Your answer"
        aria-label="Your answer"
        aria-describedby="basic-addon2"
        autoFocus
      />
      <div className="input-group-append">
        <button
          type="submit"
          className="bg-blue-500 rounded-lg font-bold text-white text-center px-4 py-3 transition duration-300 ease-in-out hover:bg-blue-600"
          disabled={!guess}
          onClick={() => {
            submit(guess);
          }}
        >
          ⮑
        </button>
      </div>
    </div>
  );
};
