import React, { useState } from "react";

interface Props {
  onChange: (date: Date | null) => void; // Callback to return a Date object or null if invalid
}

const DatePicker: React.FC<Props> = ({ onChange }) => {
  const [day, setDay] = useState<number | undefined>();
  const [month, setMonth] = useState<number | undefined>();
  const [year, setYear] = useState<number | undefined>();

  const handleDayChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value >= 1 && value <= 31) {
      setDay(value);
      emitDate(value, month, year);
    } else {
      setDay(undefined);
      emitDate(undefined, month, year);
    }
  };

  const handleMonthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value >= 1 && value <= 12) {
      setMonth(value - 1); // Month is 0-indexed for the Date constructor
      emitDate(day, value - 1, year);
    } else {
      setMonth(undefined);
      emitDate(day, undefined, year);
    }
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value >= 0) {
      setYear(value);
      emitDate(day, month, value);
    } else {
      setYear(undefined);
      emitDate(day, month, undefined);
    }
  };

  const emitDate = (d?: number, m?: number, y?: number) => {
    if (d !== undefined && m !== undefined && y !== undefined) {
      const date = new Date();
      date.setFullYear(y);
      date.setMonth(m);
      date.setDate(d);
      onChange(date); // Emit a valid Date object
    } else {
      onChange(null); // Emit null if any field is incomplete
    }
  };

  return (
    <div style={{ display: "flex", gap: "5px", alignItems: "center" }}>
      <input
        type="number"
        placeholder="DD"
        value={day ?? ""}
        onChange={handleDayChange}
        min={1}
        max={31}
        style={{ width: "50px", textAlign: "center" }}
      />
      <span>.</span>
      <input
        type="number"
        placeholder="MM"
        value={month !== undefined ? month + 1 : ""}
        onChange={handleMonthChange}
        min={1}
        max={12}
        style={{ width: "50px", textAlign: "center" }}
      />
      <span>.</span>
      <input
        type="number"
        placeholder="YYYY"
        value={year ?? ""}
        onChange={handleYearChange}
        min={0}
        max={1000}
        style={{ width: "70px", textAlign: "center" }}
      />
    </div>
  );
};

export default DatePicker;
