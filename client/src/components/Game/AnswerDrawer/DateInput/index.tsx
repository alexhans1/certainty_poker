import React, { useState } from "react";
import DatePicker from "react-date-picker";
interface Props {
  handleSubmit: (guess: number) => void;
}

function formatDateToString(date: Date) {
  return date.toISOString().slice(0, 10).replaceAll("-", "");
}

function DateInput({ handleSubmit }: Props) {
  const [guess, setGuess] = useState<Date>();

  const submit = (stringValue?: string) => {
    if (stringValue) {
      const value = parseInt(stringValue.replaceAll("-", ""));
      if (value) {
        handleSubmit(value);
        setGuess(undefined);
      }
    }
  };

  return (
    <div className="grid grid-cols-2 gap-4">
      <DatePicker
        className="bg-white"
        dayPlaceholder="DD"
        monthPlaceholder="MM"
        yearPlaceholder="YYYY"
        calendarClassName="hidden"
        showLeadingZeros={true}
        calendarIcon={null}
        value={guess}
        onChange={(date: Date | Date[]) => {
          setGuess(date as Date);
        }}
      />
      <button
        type="submit"
        className="bg-blue-500 mr-auto rounded-lg font-bold text-white text-center px-4 py-3 transition duration-300 ease-in-out hover:bg-blue-600"
        disabled={!guess}
        onClick={() => {
          if (guess) {
            submit(formatDateToString(guess));
          }
        }}
      >
        Submit
      </button>
    </div>
  );
}

export default DateInput;
