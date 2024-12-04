import { AiOutlineEye } from "react-icons/ai";
import { Tooltip } from "@mui/material";

function RevealGuessButton({ playerId, gameId }: any) {
  const revealGuess = (playerId: string, gameId: string) => {};

  return (
    <Tooltip title="Reveal Your Answer">
      <button
        className="new-question-button rounded-lg font-bold text-center text-blue-500 px-2 py-2 text-xs md:text-base transition duration-300 ease-in-out hover:text-blue-700 mx-auto"
        onClick={() => {
          revealGuess(playerId, gameId);
        }}
      >
        <AiOutlineEye size={25} />
      </button>
    </Tooltip>
  );
}

export default RevealGuessButton;
