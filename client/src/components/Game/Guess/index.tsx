import React from "react";
import moment from "moment";
// import NumberFormat from "react-number-format";
import { Answer, Question, QuestionTypes } from "../../../interfaces";

interface Props {
  guess: Answer;
  questionType?: QuestionTypes;
  alternatives?: Question["alternatives"];
}

export default ({ guess, questionType, alternatives }: Props) => {
  if (!guess) return null;
  switch (questionType) {
    case QuestionTypes.NUMERICAL:
      return (
        <span>
          {new Intl.NumberFormat().format(
            typeof guess.numerical === "number"
              ? guess.numerical
              : parseFloat(guess.numerical || "")
          )}
        </span>
      );
    case QuestionTypes.DATE:
      if (!guess.numerical) {
        return null;
      }
      return (
        <span>
          {moment(guess.numerical.toString(), "YYYYMMDD").format(
            "MMM DD, YYYY"
          )}
        </span>
      );
    case QuestionTypes.GEO:
      return <span>{`[${guess.geo?.latitude}, ${guess.geo?.longitude}]`}</span>;
    case QuestionTypes.MULTIPLE_CHOICE:
      if (alternatives?.length !== 4) {
        throw new Error("missing alternatives for multiple choice question");
      }
      return <span>{alternatives[guess.numerical ?? -1]}</span>;
    default:
      throw new Error("Invalid question type");
  }
};
