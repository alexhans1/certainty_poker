import { Answer, Question, QuestionTypes } from "../../../interfaces";
import { CSVDataRow } from ".";

export default (rows: { data: CSVDataRow }[]): Omit<Question, "id">[] => {
  return rows.map((row) => {
    const {
      question,
      type,
      answer: csvAnswer,
      latitude,
      longitude,
      hint1,
      hint2,
      explanation,
      multiple_choice_alternative1,
      multiple_choice_alternative2,
      multiple_choice_alternative3,
    } = row.data;
    const hints = [hint1, hint2].filter(Boolean) as string[];
    const answer: Answer = {};
    let alternatives: Question["alternatives"];
    switch (type) {
      case QuestionTypes.NUMERICAL:
        answer.numerical = csvAnswer as number;
        break;
      case QuestionTypes.DATE:
        answer.numerical = csvAnswer as number;
        break;
      case QuestionTypes.GEO:
        answer.geo = {
          latitude: latitude as number,
          longitude: longitude as number,
        };
        break;
      case QuestionTypes.MULTIPLE_CHOICE:
        answer.numerical = 0;
        alternatives = [
          csvAnswer as string,
          multiple_choice_alternative1 as string,
          multiple_choice_alternative2 as string,
          multiple_choice_alternative3 as string,
        ];
        break;
      default:
        throw new Error("invalid question type");
    }
    return {
      question,
      type,
      answer,
      hints,
      explanation,
      alternatives,
    };
  });
};
