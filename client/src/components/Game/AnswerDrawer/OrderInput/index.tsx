import React, { useState } from "react";
import { List, arrayMove } from "react-movable";

interface Props {
  options: string[];
  handleSubmit: (guess: string[]) => void;
}

export default function OrderInput({ options, handleSubmit }: Props) {
  const [order, setOrder] = useState(options);

  return (
    <div className="flex flex-col">
      <div className="grid grid-cols-2 gap-4">
        <List
          values={order}
          onChange={({ oldIndex, newIndex }) =>
            setOrder(arrayMove(order, oldIndex, newIndex))
          }
          renderList={({ children, props }) => (
            <div className="grid gap-y-3" style={{ zIndex: 4000 }} {...props}>
              {children}
            </div>
          )}
          renderItem={({ value, props }) => (
            <span
              style={{ visibility: "visible" }}
              className="px-4 py-3 cursor-pointer border text-center border-gray-400 rounded-md bg-white"
              {...props}
            >
              {value}
            </span>
          )}
        />
        {/* <button
          type="submit"
          className="bg-blue-500 mr-auto rounded-lg font-bold text-white text-center px-4 py-3 transition duration-300 ease-in-out hover:bg-blue-600"
          disabled={typeof guess === "string" || (!guess && guess !== 0)}
          onClick={() => {
            handleSubmit(guess);
            setGuess("");
          }}
        > */}
        {/* Submit
        </button> */}
      </div>
    </div>
  );
}
