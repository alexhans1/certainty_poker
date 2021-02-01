import React, { useState } from "react";
import { GeoCoordinate } from "../../../../interfaces";
import Map from "../../../Game/Map";

interface Props {
  handleSubmit: (guess: GeoCoordinate) => void;
}

export default ({ handleSubmit }: Props) => {
  const [guess, setGuess] = useState<GeoCoordinate>();

  return (
    <>
      <Map
        handleOnClick={(p: GeoCoordinate) => {
          setGuess(p);
        }}
      />
      <button
        className="bg-blue-500 rounded-lg font-bold text-white text-center px-4 py-3 transition duration-300 ease-in-out hover:bg-blue-600 ml-auto"
        onClick={() => {
          if (guess) {
            handleSubmit(guess);
            setGuess(undefined);
          }
        }}
        disabled={!guess?.latitude || !guess.longitude}
      >
        Submit
      </button>
    </>
  );
};
