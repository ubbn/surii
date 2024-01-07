import { CellContext, createColumnHelper } from "@tanstack/react-table";
import { Popover, Tooltip } from "antd";
import { addDays, format, isBefore } from "date-fns";
import * as React from "react";
import styled from "styled-components";

import { getDateFromStr, isEqual, yyyyMMdd } from "../utils";
import { isUndefNull } from "../../../common/utils";

export const renderOgnooCell = (value: string) => {
  if (!value) return <></>;

  const ognoo = getDateFromStr(value) || new Date();
  const pppPp = format(ognoo, "PPPPpppp");

  return (
    <div style={{ margin: "0 10px" }}>
      <Tooltip title={pppPp}>{format(ognoo, "yyyy-MM-dd")}</Tooltip>
    </div>
  );
};

const CellMemo = styled.div<{ background?: string }>`
  background-color: ${(p) => p.background};
  color: white;
  font-weight: bold;
  border-radius: 2px;
`;

export const renderMemoCell = (
  checkDate = new Date(),
  value: CellContext<Neuron, any>,
  day: number
): React.ReactElement => {
  if (!value.row.original.created) return <></>;
  const created = getDateFromStr(value.row.original.created);
  if (!created) return <></>;

  const studyDate = addDays(created, day);
  let cellValue = value.getValue();
  let backgroundColor = "white";
  if (isEqual(checkDate, studyDate)) {
    backgroundColor = "#fbb14e"; // Study this day
    cellValue = isUndefNull(cellValue) ? "?" : cellValue;
  } else if (cellValue === 5) backgroundColor = "#365f1d";
  else if (cellValue === 4) backgroundColor = "#49852e";
  else if (cellValue === 3) backgroundColor = "#5aac44";
  else if (cellValue === 2) backgroundColor = "#61bd4f";
  else if (cellValue === 1) backgroundColor = "#99d18f";
  else if (cellValue === 0) backgroundColor = "#d6e685";
  else if (isBefore(studyDate, checkDate)) {
    // No memo till date we are checking
    cellValue = "x";
    backgroundColor = "#f08b7b";
  } else {
    cellValue = ".";
  }
  return (
    // <Popover
    //   placement="bottomLeft"
    //   content={<>Due on {format(studyDate, yyyyMMdd)}</>}
    //   title={<strong>{`Day ${day}`}</strong>}
    //   trigger="hover"
    // >
    <CellMemo
      style={{ backgroundColor }}
      title={`Day ${day} on ${format(studyDate, yyyyMMdd)}`}
    >
      {cellValue}
    </CellMemo>
    //</Popover>
  );
};

const columnHelper = createColumnHelper<Neuron>();

export const getColumns = (
  count: number,
  studyInterval: number[],
  studyDate: Date,
  renderNodeTitle: (v: string) => void
) => {
  return [
    columnHelper.group({
      header: `${count} neuron${count > 1 ? "s" : ""}`,
      columns: [
        columnHelper.accessor((row) => row.created, {
          id: "ognoo",
          header: () => <span>Ognoo</span>,
          cell: (info) => renderOgnooCell(info.getValue()),
          enableSorting: true,
          sortingFn: "alphanumeric",
        }),
        columnHelper.accessor("title", {
          header: () => <span>Neuron</span>,
          cell: (info) => info.getValue(),
        }),
        columnHelper.accessor("ntree", {
          header: () => <span>Category</span>,
          cell: (info) => renderNodeTitle(info.getValue()),
        }),
      ],
    }),
    columnHelper.group({
      header: "Repitition intervals (days)",
      columns: studyInterval.map((day) =>
        columnHelper.accessor(mapRepititionDays(day), {
          id: `${day}`,
          cell: (cell) => renderMemoCell(studyDate, cell, day),
        })
      ),
    }),
  ];
};

const mapRepititionDays = (day: number): any => {
  return (row: Neuron) => {
    if (row.memo) {
      return row.memo[`${day}`];
    } else {
      return "";
    }
  };
};
