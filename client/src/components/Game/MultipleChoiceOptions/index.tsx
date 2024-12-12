import { QuestionRound, QuestionTypes } from "../../../interfaces"
import { getRevealAnswer } from "../helpers"

import "./index.css"

interface Props {
  usedQuestionRound: QuestionRound
  handleClick?: (i: number) => void
  guess?: number
}

export default function MultipleChoiceOptions({
  usedQuestionRound,
  handleClick,
  guess,
}: Props) {
  if (usedQuestionRound.question.type !== QuestionTypes.MULTIPLE_CHOICE) {
    return null
  }
  if (usedQuestionRound.question.alternatives?.length !== 4) {
    throw new Error("missing alternatives for multiple choice question")
  }
  const alternatives = usedQuestionRound.question.alternatives.map((alt) => ({
    value: alt,
    active: !usedQuestionRound.question.hiddenAlternatives?.includes(alt),
  }))

  const revealAnswer = getRevealAnswer(usedQuestionRound)
  const answer = usedQuestionRound.question.answer.numerical

  return (
    <div className="mc-container my-2">
      {alternatives.map((alt, i) => {
        let optionClassName =
          "text-center border-2 border-blue-600 rounded-lg shadow px-4 py-3 font-bold focus:outline-none"
        if (!handleClick) {
          optionClassName += " no-pointer"
        }
        if (alt.active) {
          if (handleClick) {
            optionClassName += " hover:bg-blue-600 hover:text-white"
            if (guess === i) {
              optionClassName += " text-white bg-blue-600"
            } else {
              optionClassName += " text-blue-600"
            }
          } else {
            optionClassName += " text-blue-600"
          }
        } else {
          optionClassName += " text-blue-600"
        }
        return (
          <button
            key={`${alt.value}_${i}`}
            className={optionClassName}
            onClick={() => handleClick && handleClick(i)}
            disabled={!alt.active || (revealAnswer && i !== answer)}
          >
            {alt.value}
          </button>
        )
      })}
    </div>
  )
}
