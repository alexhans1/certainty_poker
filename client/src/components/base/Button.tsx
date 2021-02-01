import React from "react";

interface Props {
  onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  className?: string;
  children: React.ReactNode;
}

function Button({ onClick, className, children }: Props) {
  return (
    <button
      onClick={onClick}
      className={`inline-block px-6 py-2 text-xs font-medium leading-6 text-center text-white uppercase bg-blue-500 hover:bg-blue-600 transition rounded shadow ripple hover:shadow-lg focus:outline-none ${className}`}
    >
      {children}
    </button>
  );
}

export const ButtonLink = ({ onClick, className, children }: Props) => (
  <button
    onClick={onClick}
    className={`text-blue-500 hover:text-blue-600 p-2 ripple focus:outline-none ${className}`}
  >
    {children}
  </button>
);

export default Button;
