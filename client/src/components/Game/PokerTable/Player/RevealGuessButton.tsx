import { Tooltip } from "@mui/material"
import { AiOutlineEye } from "react-icons/ai"
import { revealGuess } from "../../../../db"
import { useGame } from "../../Context"

interface Props {
  playerId: string
}

function RevealGuessButton({ playerId }: Props) {
  const { game } = useGame()
  const questionRounds = game?.questionRounds

  if (!questionRounds) {
    return null
  }

  return (
    <Tooltip title="Reveal Your Answer">
      <button
        className="new-question-button rounded-lg font-bold text-center text-blue-500 px-2 py-2 text-xs md:text-base transition duration-300 ease-in-out hover:text-blue-700 mx-auto"
        onClick={() => {
          revealGuess(game, playerId)
        }}
      >
        <AiOutlineEye size={25} />
      </button>
    </Tooltip>
  )
}

export default RevealGuessButton
