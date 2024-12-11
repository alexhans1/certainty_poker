import { useState } from "react";
import { DateInput } from "rsuite";

import { QuestionTypes } from "../../../../interfaces";
import FormattedGuess from "../../Guess";

interface Props {
  handleSubmit: (guess: number) => void;
}

function formatDateToNumber(date: Date): number {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");

  return parseInt(`${year}${month}${day}`, 10);
}

function DateInputComp({ handleSubmit }: Props) {
  const [guess, setGuess] = useState(new Date());

  return (
    <div className="grid grid-cols-2 gap-4">
      <DateInput
        className="pl-2"
        format="dd/MM/yyyy"
        value={guess}
        onChange={(dateValue) => {
          setGuess(dateValue as Date);
        }}
      />
      <button
        type="submit"
        className="bg-blue-500 mr-auto rounded-lg font-bold text-white text-center px-4 py-3 transition duration-300 ease-in-out hover:bg-blue-600"
        disabled={!guess}
        onClick={() => {
          if (guess) {
            handleSubmit(formatDateToNumber(guess));
          }
        }}
      >
        Submit
      </button>

      {guess && (
        <p className="-mt-2 text-sm h-2">
          <FormattedGuess
            {...{
              guess: {
                numerical: formatDateToNumber(guess),
              },
              questionType: QuestionTypes.DATE,
            }}
          />
        </p>
      )}
    </div>
  );
}

export default DateInputComp;
