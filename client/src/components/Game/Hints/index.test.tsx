import React from "react";
import { render } from "@testing-library/react";
import Hints from ".";

test("renders learn react link", () => {
  const { getByText } = render(<Hints />);
  const linkElement = getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
