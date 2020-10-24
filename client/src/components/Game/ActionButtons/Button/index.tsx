import React from "react";

interface ActionButtonProps {
  text: string;
  handleOnClick: () => void;
  isDisabled?: boolean;
}

export default ({ text, handleOnClick, isDisabled }: ActionButtonProps) => {
  return (
    <button
      className="btn btn-primary mx-2"
      onClick={handleOnClick}
      disabled={isDisabled}
    >
      {text}
    </button>
  );
};
