import { lazy, Suspense } from "react"
import { Link, Route, Routes } from "react-router"

const Game = lazy(() => import("../Game"))
const Lobby = lazy(() => import("../Lobby"))

function PageNotFound() {
  return <p>Page not found.</p>
}

function App() {
  return (
    <div className="mx-auto flex flex-col max-w-full sm:max-w-screen-sm md:max-w-screen-md lg:max-w-screen-lg xl:max-w-screen-xl px-3">
      <Link to="/" className="mt-4 text-3xl font-bold">
        Certainty Poker
      </Link>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={<Lobby />} />
          <Route path="/:gameId" element={<Game />} />
          <Route path="/questions/:setName" element={<Lobby />} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </Suspense>
    </div>
  )
}

export default App
