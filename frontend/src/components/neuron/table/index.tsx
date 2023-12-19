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
import { useDispatch, useSelector } from "react-redux";
import { FlexRow } from "../../../common";
import DatePicker from "../../../common/DatePicker";
import Tooltip from "../../../common/tooltip";
import { setStudyDate } from "../../../redux/neuronSlice";
import { RootState } from "../../../redux/store";
import { getDateFromStr } from "../utils";
import ITableStyled, { getCellClassName, getHeaderCellStyle } from "./styled";
import { getColumns } from "./util";

type Interval = {
  name: string;
  desc: string;
  days: number[];
};

const intervalsNew: Interval[] = [
  {
    name: "Short term",
    desc: "More frequent, suited for memorizing short term",
    days: [1, 3, 5, 7, 10, 14, 18, 21, 28, 35, 42, 49],
  },
  {
    name: "Normal",
    desc: "Normal frequency, most suited for efficiency and longevity",
    days: [1, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233],
  },
  {
    name: "Long term",
    desc: "Less frequent, suited for memorizing longer term",
    days: [1, 7, 14, 30, 45, 90, 180, 365, 500],
  },
];

function ITable({
  onStudy,
  onClick,
}: {
  onStudy: (neurons: Neuron[]) => void;
  onClick: (neuron: Neuron, column: number, day?: number) => void;
}) {
  const [visibleNeurons, setVisibleNeurons] = React.useState<Neuron[]>([]);
  const [sorting, setSorting] = React.useState<SortingState>([
    {
      id: "ognoo",
      desc: true,
    },
  ]);
  const [studyInterval, setStudyInterval] = React.useState<number>(1);
  const { items, leaves, studyDate } = useSelector((v: RootState) => v.neuron);
  const dispatch = useDispatch();

  const columns = React.useMemo<ColumnDef<Neuron>[]>(
    () =>
      getColumns(
        visibleNeurons.length,
        intervalsNew[studyInterval]?.days || [],
        studyDate || new Date(),
        (treeNodeId) => {
          const found = leaves.find((v) => (v.key as number) === +treeNodeId);
          return <span>{found?.title}</span>;
        }
      ),
    [studyInterval, visibleNeurons.length]
  );

  const table = useReactTable({
    data: visibleNeurons,
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
  }, [items]);

  const onDateChange = (value: Date | null) => {
    dispatch(setStudyDate(value));
    filterNeurons(value);
  };

  const filter = (value: Date) => {
    return items.filter((neuron: Neuron) => {
      if (neuron.created) {
        const created = getDateFromStr(neuron.created) || new Date();
        const diff = differenceInCalendarDays(value, created);
        return intervalsNew[studyInterval].days.includes(diff);
      }
      return false;
    });
  };

  const filterNeurons = (value?: Date | null) => {
    if (value) {
      setVisibleNeurons(filter(value));
    } else {
      setVisibleNeurons(items);
    }
  };

  const onCellClick = (item: Neuron, column: number) => {
    if (column >= 3) {
      const intervalId = column - 3;
      const interval = intervalsNew[studyInterval].days;
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
      <FlexRow style={{ marginBottom: 10, alignItems: "center" }}>
        <Button
          type="primary"
          onClick={() => onStudy(filter(studyDate || new Date()))}
        >
          Study today
        </Button>
        <DatePicker
          placeholder="Study date"
          value={studyDate}
          onChange={onDateChange}
          style={{ marginRight: 10, width: 120, border: "1px solid #1677ff" }}
        />
        <Segmented
          options={intervalsNew.map((v, i) => ({
            label: <SegmentIdem interval={v} />,
            value: i,
          }))}
          value={studyInterval}
          onChange={(v) => setStudyInterval(+v)}
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

const SegmentIdem = ({ interval }: { interval: Interval }) => {
  return (
    <Tooltip text={interval.desc} placement="bottom">
      <span>{interval.name}</span>
    </Tooltip>
  );
};
