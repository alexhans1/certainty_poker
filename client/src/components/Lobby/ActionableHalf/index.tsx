import { lazy, Suspense, useState } from "react"
import { Set } from "../../../interfaces"
import StartGameModal from "../StartGameModal"

const NewSetBanner = lazy(() => import("../NewSetBanner"))

interface Props {
  sets?: Set[]
  setName?: string
}

export default function ActionableHalf({ sets = [] }: Props) {
  const [isCreateGameModalOpen, setIsCreateGameModalOpen] = useState(false)
  const promotedSet = sets.find((set) => set.isPromotedUntil || 0 > Date.now())

  return (
    <>
      <div className="flex flex-col justify-end h-full py-8 lg:pb-32 lg:pt-0">
        {promotedSet && (
          <Suspense fallback={<div>Loading...</div>}>
            <NewSetBanner
              set={promotedSet}
              className="mb-8 lg:mb-auto lg:mt-5"
            />
          </Suspense>
        )}
        <h1 className="text-5xl">
          <span className="font-light italic">Think you know it all?</span>
          <br />
          Let’s raise the stakes!
        </h1>
        <p className="text-xl mt-3">
          A <b>free</b> poker-style trivia game.
        </p>
        <button
          onClick={() => {
            setIsCreateGameModalOpen(true)
          }}
          className="border border-blue-600 rounded-full font-bold text-3xl text-blue-600 hover:text-white text-center px-8 py-4 transition duration-300 ease-in-out hover:bg-blue-600 mt-8 mr-auto focus:outline-none"
        >
          Create Game
        </button>
        <p className="mt-10">
          Check out the rules{" "}
          <a
            className="text-blue-700 hover:text-blue-900 p-0"
            href="https://docs.google.com/document/d/13pwz8yzrPdY1DcQqXvhejJAxXdWdPrvxR6GUxg5PJPs/edit?usp=sharing"
            target="_blank"
            rel="noopener noreferrer"
          >
            here
          </a>
          .
        </p>
      </div>
      <StartGameModal
        sets={sets}
        open={isCreateGameModalOpen}
        handleOpen={() => {
          setIsCreateGameModalOpen(true)
        }}
        handleClose={() => {
          setIsCreateGameModalOpen(false)
        }}
      />
    </>
  )
}
