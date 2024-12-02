import React, { useState } from "react";
import { AiOutlineEye } from "react-icons/ai";
import { useMutation } from "react-apollo";
import { GameAndPlayerIds, REVEAL_GUESS } from "../../../../api/queries";
import { Tooltip } from "@mui/material";

function RevealGuessButton({ playerId, gameId }: GameAndPlayerIds) {
  const [_, setError] = useState();
  const [revealGuess] = useMutation<any, GameAndPlayerIds>(REVEAL_GUESS, {
    onError: (err) => {
      setError(() => {
        throw err;
      });
    },
  });

  return (
    <Tooltip title="Reveal Your Answer">
      <button
        className="new-question-button rounded-lg font-bold text-center text-blue-500 px-2 py-2 text-xs md:text-base transition duration-300 ease-in-out hover:text-blue-700 mx-auto"
        onClick={() => {
          revealGuess({
            variables: { playerId, gameId },
          });
        }}
      >
        <AiOutlineEye size={25} />
      </button>
    </Tooltip>
  );
}

export default RevealGuessButton;
