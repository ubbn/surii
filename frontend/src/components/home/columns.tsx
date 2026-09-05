import { createColumnHelper } from "@tanstack/react-table";
import { Streak } from "./utils";

const columnHelper = createColumnHelper<Streak>();

export const streakColumns = [
  columnHelper.accessor("rank", {
    header: () => <span>Rank</span>,
    cell: (info) => `#${info.getValue()}`,
    enableSorting: true,
  }),
  columnHelper.accessor("length", {
    header: () => <span>Length</span>,
    cell: (info) => {
      const value = info.getValue();
      const isCurrent = info.row.original.isCurrent;
      return `${value} day${value > 1 ? "s" : ""}${isCurrent ? " 😎" : ""}`;
    },
    enableSorting: true,
  }),
  columnHelper.accessor("startDate", {
    header: () => <span>Start date</span>,
    cell: (info) => info.getValue(),
    enableSorting: true,
    sortingFn: "alphanumeric",
  }),
  columnHelper.accessor("endDate", {
    header: () => <span>End date</span>,
    cell: (info) => info.getValue(),
    enableSorting: true,
    sortingFn: "alphanumeric",
  }),
];
