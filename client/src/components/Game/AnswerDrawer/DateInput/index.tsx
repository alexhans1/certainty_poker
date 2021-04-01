import React, { useState } from "react";
import DatePicker from "react-date-picker";
interface Props {
  handleSubmit: (guess: number) => void;
}

function formatDateToString(date: Date) {
  var mm = date.getMonth() + 1; // getMonth() is zero-based
  var dd = date.getDate();

  return [
    date.getFullYear(),
    (mm > 9 ? "" : "0") + mm,
    (dd > 9 ? "" : "0") + dd,
  ].join("");
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
