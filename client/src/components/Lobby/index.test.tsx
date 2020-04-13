import React from "react";
import { render } from "@testing-library/react";
import Lobby from ".";

test("renders learn react link", () => {
  const { getByText } = render(<Lobby />);
  const linkElement = getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
