import { useState } from "react"
import { useNavigate } from "react-router"

import image from "../../../assets/2021.png"
import { createGame } from "../../../db"
import { Set } from "../../../interfaces"

interface Props {
  set: Set
  className?: string
}
function NewSetBanner({ className = "", set }: Props) {
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const handleCreateGame = async () => {
    setLoading(true)
    await createGame([set], (gameId: string) => {
      navigate(`/${gameId}`)
    })
    setLoading(false)
  }

  return (
    <div
      className={`bg-yellow-200 relative text-lg rounded-2xl px-5 py-6 mr-auto max-w-sm ${className}`}
    >
      <p>
        <b className="text-2xl">2021 Quiz </b>
      </p>
      <p className="mt-2">
        New question set with all 2021 trivia.{" "}
        <i>News, pop culture, arts and sports.</i>
        <br />
        Do you remember what happened this past year?
      </p>
      <button
        className="mt-6 bg-black rounded-full font-semi-bold text-white text-center px-6 py-3 transition duration-300 ease-in-out hover:text-black hover:bg-white border border-black focus:outline-none mr-auto"
        onClick={() => {
          handleCreateGame()
        }}
      >
        {loading ? "Loading..." : "Start 2021 Quiz"}
      </button>
      <img
        className="absolute bottom-3 right-3 transform -rotate-12"
        style={{ width: "35%" }}
        src={image}
        alt="2021"
      />
    </div>
  )
}

export default NewSetBanner
