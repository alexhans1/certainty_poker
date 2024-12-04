import { Answer, Question, QuestionTypes } from "../../../interfaces";

interface Props {
  guess: Answer;
  questionType: QuestionTypes;
  alternatives?: Question["alternatives"];
}

function formatDateString(dateStr: string): string {
  const [year, month, day] = [
    dateStr.slice(0, 4),
    dateStr.slice(4, 6),
    dateStr.slice(6, 8),
  ];
  return new Date(+year, +month - 1, +day).toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
}

export default function Guess({ guess, questionType, alternatives }: Props) {
  if (!guess) return null;
  switch (questionType) {
    case QuestionTypes.NUMERICAL: {
      const number =
        typeof guess.numerical === "number"
          ? guess.numerical
          : parseFloat(guess.numerical || "");
      if (isNaN(number)) {
        return null;
      }
      return <span>{new Intl.NumberFormat().format(number)}</span>;
    }
    case QuestionTypes.DATE:
      if (!guess.numerical) {
        return null;
      }
      return <span>{formatDateString(guess.numerical.toString())}</span>;
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
}
