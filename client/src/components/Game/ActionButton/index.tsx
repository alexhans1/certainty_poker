import React from "react";

interface ActionButtonProps {
  text: string;
  handleOnClick: () => void;
}

export default ({ text, handleOnClick }: ActionButtonProps) => {
  return (
    <button className="btn btn-dark mt-4 mx-1" onClick={handleOnClick}>
      {text}
    </button>
  );
};
