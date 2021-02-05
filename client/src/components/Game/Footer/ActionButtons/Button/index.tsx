import React from "react";

interface ActionButtonProps {
  text: string;
  handleOnClick: () => void;
  isDisabled?: boolean;
}

export default function ActionButton({
  text,
  handleOnClick,
  isDisabled,
}: ActionButtonProps) {
  return (
    <button
      className="bg-blue-500 rounded-lg font-bold text-white text-center px-4 py-3 transition duration-300 ease-in-out hover:bg-blue-600 w-full"
      onClick={handleOnClick}
      disabled={isDisabled}
    >
      {text}
    </button>
  );
}
