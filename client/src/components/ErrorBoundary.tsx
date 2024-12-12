import { FallbackProps } from "react-error-boundary"
import { BiError } from "react-icons/bi"

const Fallback = ({ error }: FallbackProps) => {
  const errorMessage = error?.message.replace("GraphQL error: ", "")
  return (
    <p className="text-lg mt-6 flex items-center font-semibold">
      <BiError className="text-4xl text-red-600 mr-3" />
      {errorMessage === "Game not found" ? (
        <>{errorMessage}</>
      ) : (
        <>
          A technical error has occurred: "{errorMessage}"
          <br /> Try to refresh the page.
        </>
      )}
    </p>
  )
}

export default Fallback
