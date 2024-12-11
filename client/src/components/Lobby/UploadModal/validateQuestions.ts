import { Question, QuestionTypes } from "../../../interfaces";

const numericalQuestionTypes = [
  QuestionTypes.NUMERICAL,
  QuestionTypes.DATE,
  QuestionTypes.MULTIPLE_CHOICE,
];

export function validateQuestions(questions: Question[]): void {
  for (let i = 0; i < questions.length; i++) {
    const q = questions[i];

    if (numericalQuestionTypes.includes(q.type) && !q.answer.numerical) {
      throw new Error(
        `Error with question ${
          i + 1
        } in your file: "answer" cannot be null for numerical, multiple choice and date questions`,
      );
    }

    if (
      q.type === QuestionTypes.GEO &&
      (!q.answer.geo ||
        q.answer.geo.latitude === null ||
        q.answer.geo.longitude === null)
    ) {
      throw new Error(
        `Error with question ${
          i + 1
        } in your file: "latitude" or "longitude" cannot be null for geo questions`,
      );
    }

    if (q.type === QuestionTypes.MULTIPLE_CHOICE) {
      if (![1, 2, 3, 4].includes(q.answer.numerical as number)) {
        throw new Error(
          `Error with question ${
            i + 1
          } in your file: "answer" must be 1, 2, 3 or 4 for multiple choice questions`,
        );
      }
      if (!q.alternatives || q.alternatives.length < 4) {
        throw new Error(
          `Error with question ${
            i + 1
          } in your file: All "alternatives" must be set for multiple choice questions`,
        );
      }
    }
  }
}
