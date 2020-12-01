import React from "react";
import { QuestionRound } from "../../../interfaces";
import { getRevealAnswer } from "../helpers";

import "./index.scss";

interface Props {
  usedQuestionRound?: QuestionRound;
  handleClick?: (i: number) => void;
  guess?: number;
}

export default ({ usedQuestionRound, handleClick, guess }: Props) => {
  if (!usedQuestionRound) {
    return null;
  }
  if (usedQuestionRound.question.alternatives?.length !== 4) {
    throw new Error("missing alternatives for multiple choice question");
  }
  const alternatives = usedQuestionRound.question.alternatives.map((alt) => ({
    value: alt,
    active: !usedQuestionRound.question.hiddenAlternatives?.includes(alt),
  }));

  const revealAnswer = getRevealAnswer(usedQuestionRound);
  const answer = usedQuestionRound.question.answer.numerical;

  return (
    <div className="mc-container mb-3">
      {alternatives.map((alt, i) => {
        let buttonClassName = "btn";
        if (!handleClick) {
          buttonClassName += " no-pointer";
        }
        if (guess === i) {
          buttonClassName += " shadow";
        }
        if (alt.active) {
          if (revealAnswer && i === answer) {
            if (guess === i) {
              buttonClassName += " btn-success";
            } else {
              buttonClassName += " btn-outline-success";
            }
          } else {
            if (handleClick) {
              buttonClassName += " btn-outline-dark";
              if (guess === i) {
                buttonClassName += " bg-dark text-light";
              }
            } else {
              buttonClassName += " btn-outline-light";
              if (guess === i) {
                buttonClassName += " bg-light text-dark";
              }
            }
          }
        } else {
          if (guess === i) {
            buttonClassName += " btn-danger";
          } else {
            buttonClassName += " btn-outline-danger";
          }
        }
        return (
          <button
            key={`${alt.value}_${i}`}
            className={buttonClassName}
            onClick={() => handleClick && handleClick(i)}
            disabled={!alt.active || (revealAnswer && i !== answer)}
          >
            {alt.value}
          </button>
        );
      })}
    </div>
  );
};
