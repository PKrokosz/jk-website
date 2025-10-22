import React from "react";
import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { accountOrderHistory } from "@/lib/account/order-history";

import { OrderHistoryList } from "../OrderHistoryList";

describe("OrderHistoryList", () => {
  it("renders cards for each order in the history", () => {
    render(<OrderHistoryList />);

    const list = screen.getByRole("list");
    const items = within(list).getAllByRole("listitem");

    expect(items).toHaveLength(accountOrderHistory.length);
    expect(screen.getByText(/Sabatony LARP — model Wiking/)).toBeInTheDocument();
    expect(screen.getByText(/Oficerki sceniczne — model Husarz/)).toBeInTheDocument();
    expect(screen.getByText(/Trzewiki podróżne — model Wędrowiec/)).toBeInTheDocument();
  });
});
