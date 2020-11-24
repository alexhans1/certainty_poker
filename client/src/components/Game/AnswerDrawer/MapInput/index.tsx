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
        className="btn btn-primary ml-auto"
        onClick={() => {
          guess && handleSubmit(guess);
        }}
        disabled={!guess?.latitude || !guess.longitude}
      >
        Submit
      </button>
    </>
  );
};
