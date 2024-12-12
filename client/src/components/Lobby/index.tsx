import { collection, onSnapshot } from "firebase/firestore"
import { useEffect, useState } from "react"
import { useParams } from "react-router"
import db from "../../db/index.ts"
import { Set } from "../../interfaces.ts"
import ErrorFallback from "../ErrorBoundary.tsx"
import ActionableHalf from "./ActionableHalf/index.tsx"
import PictureHalf from "./PictureHalf/index.tsx"

import { withErrorBoundary } from "react-error-boundary"
import "./styles.css"

function Lobby() {
  const { setName } = useParams<{ setName: string }>()
  const [questionSets, setQuestionSets] = useState<Set[]>([])

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "question-sets"),
      (querySnapshot) => {
        const newData = querySnapshot.docs.map<Set>((doc) => doc.data() as Set)
        setQuestionSets(newData)
      },
    )

    // Cleanup subscription on component unmount
    return () => {
      unsubscribe()
    }
  }, [])

  return (
    <div className="grid lg:grid-cols-2 gap-x-8 relative landing-page">
      <ActionableHalf {...{ sets: questionSets, setName }} />
      <PictureHalf />
    </div>
  )
}

export default withErrorBoundary(Lobby, {
  onError: (error) => {
    console.error("Uncaught error:", error)
  },
  FallbackComponent: ErrorFallback,
})
