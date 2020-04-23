import React from "react";
import { render } from "@testing-library/react";
import PlayerTable from ".";

test("renders learn react link", () => {
  const { getByText } = render(<PlayerTable />);
  const linkElement = getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
