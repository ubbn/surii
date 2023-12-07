import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { Button, Segmented } from "antd";
import { differenceInCalendarDays } from "date-fns";
import * as React from "react";

import { getColumns } from "./util";
import ITableStyled, { getCellClassName, getHeaderCellStyle } from "./styled";
import { getDateFromStr } from "../utils";
import { RootState } from "../../../redux/store";
import { useDispatch, useSelector } from "react-redux";
import { FlexRow } from "../../../common";
import { setStudyDate } from "../../../redux/neuronSlice";
import DatePicker from "../../../common/DatePicker";

const intervals: { [key: string]: number[] } = {
  "Short-term": [1, 3, 5, 7, 10, 14, 18, 21, 28, 35, 42, 49],
  Normal: [1, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233],
  "Long-term": [1, 7, 14, 30, 45, 90, 180, 365, 500],
};

function ITable({
  neurons,
  onClick,
}: {
  neurons: Neuron[];
  onClick: (neuron: Neuron, column: number, day?: number) => void;
}) {
  const [data, setData] = React.useState<Neuron[]>([]);
  const [sorting, setSorting] = React.useState<SortingState>([
    {
      id: "ognoo",
      desc: true,
    },
  ]);
  const [studyInterval, setStudyInterval] = React.useState<string>("Normal");
  const { leaves, studyDate } = useSelector((v: RootState) => v.neuron);
  const dispatch = useDispatch();

  const columns = React.useMemo<ColumnDef<Neuron>[]>(
    () =>
      getColumns(
        data.length,
        intervals[studyInterval],
        studyDate || new Date(),
        (treeNodeId) => {
          const found = leaves.find((v) => (v.key as number) === +treeNodeId);
          return <span>{found?.title}</span>;
        }
      ),
    [studyInterval, data.length]
  );

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  React.useEffect(() => {
    filterNeurons(studyDate);
  }, [neurons]);

  const onDateChange = (value: Date | null) => {
    dispatch(setStudyDate(value));
    filterNeurons(value);
  };

  const filterNeurons = (value?: Date | null) => {
    if (value) {
      setData(
        neurons.filter((neuron: Neuron) => {
          if (neuron.created) {
            const created = getDateFromStr(neuron.created) || new Date();
            const diff = differenceInCalendarDays(value, created);
            return intervals[studyInterval].includes(diff);
          }
          return false;
        })
      );
    } else {
      setData(neurons);
    }
  };

  const onCellClick = (item: Neuron, column: number) => {
    if (column >= 3) {
      const intervalId = column - 3;
      const interval = intervals[studyInterval];
      if (interval.length > intervalId) {
        const day = interval[intervalId];
        onClick(item, column, day);
      }
    } else {
      onClick(item, column);
    }
  };

  return (
    <ITableStyled>
      <FlexRow style={{ marginBottom: 10 }}>
        <Button type="primary" onClick={() => onDateChange(new Date())}>
          Study
        </Button>
        <DatePicker
          placeholder="Study date"
          value={studyDate}
          onChange={onDateChange}
          style={{ marginRight: 10, width: 120, border: "1px solid #1677ff" }}
        />
        <Segmented
          options={Object.keys(intervals)}
          value={studyInterval}
          onChange={(v) => setStudyInterval(v as string)}
        />
      </FlexRow>
      <table>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header, i) => (
                <th
                  onClick={header.column.getToggleSortingHandler()}
                  key={header.id}
                  colSpan={header.colSpan}
                  style={getHeaderCellStyle(i)}
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                  {{
                    asc: " 🔼",
                    desc: " 🔽",
                  }[header.column.getIsSorted() as string] ?? null}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell, j) => (
                <td
                  key={cell.id}
                  className={getCellClassName(j)}
                  onClick={() => onCellClick(row.original, j)}
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </ITableStyled>
  );
}

export default ITable;
