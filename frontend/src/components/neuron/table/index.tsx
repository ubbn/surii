import { SearchOutlined } from "@ant-design/icons";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  PaginationState,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { Button, Input, Segmented, Select } from "antd";
import { differenceInCalendarDays } from "date-fns";
import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { styled } from "styled-components";
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

const StyledDatePicker = styled(DatePicker)`
  min-width: 120px;
  border: 1px solid #1677ff;
  @media (max-width: 600px) {
    display: none;
  }
`

const StyledInput = styled(Input)`
  margin-left: 5px;
  border-radius: 0;
  width: 100%;
`

const StyledSegmented = styled(Segmented)`
  margin-left: 5px;
  @media (max-width: 600px) {
    display: none;
  }
`

const StyledSelect = styled(Select)`
  margin-left: 5px;
  @media (max-width: 600px) {
    margin: 15px 0 0;
    width: 100%;
  }
`

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
  tourRefs
}: {
  onStudy: (neurons: Neuron[]) => void;
  onClick: (neuron: Neuron, column: number, day?: number) => void;
  tourRefs: any[]
}) {
  const [visibleNeurons, setVisibleNeurons] = React.useState<Neuron[]>([]);
  const [searchKey, setSearchKey] = React.useState<string>('')
  const [sorting, setSorting] = React.useState<SortingState>([
    {
      id: "ognoo",
      desc: true,
    },
  ]);
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 40,
  })
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
      pagination
    },
    autoResetPageIndex: false, // Don't reset to page 1 when gets updated
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
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
    setSearchKey("")
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

  const onSearchNeuron = (e: any) => {
    const value = e?.target?.value
    if (value) {
      setVisibleNeurons(items.filter(v => v.title.includes(value)))
    } else {
      setVisibleNeurons(items)
    }
    setSearchKey(value)
  };

  return (
    <ITableStyled>
      <FlexRow style={{ marginBottom: 10, alignItems: "center" }}>
        <Button
          type="primary" ref={tourRefs[0]}
          onClick={() => onStudy(filter(studyDate || new Date()))}
          title="Study neurons due on today"
        >
          Study today
        </Button>
        <Tooltip text="Filter neurons due on given date" placement="bottomRight">
          <StyledDatePicker placeholder="Study date" value={studyDate} onChange={onDateChange} />
        </Tooltip>
        <StyledInput placeholder="Search neurons" allowClear
          prefix={<SearchOutlined />} value={searchKey} onChange={onSearchNeuron}
        />
        <StyledSegmented ref={tourRefs[1]}
          options={intervalsNew.map((v, i) => ({
            label: <SegmentIdem interval={v} />,
            value: i,
          }))}
          value={studyInterval}
          onChange={(v: any) => setStudyInterval(+v)}
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
                  className={String(header.column.columnDef.meta ?? "always")}
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
      <div style={{ display: "flex", margin: "15px 0 45px", flexWrap: "wrap" }}>
        <Button
          title="Go to first page"
          size="small"
          onClick={() => table.firstPage()}
          disabled={!table.getCanPreviousPage()}
        >
          {'<< first'}
        </Button>
        <Button
          title="Go to previous page"
          size="small"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          {'< prev'}
        </Button>
        <span style={{ margin: "0 10px" }}>
          <span>Page </span>
          <strong>
            {table.getState().pagination.pageIndex + 1} of{' '}
            {table.getPageCount().toLocaleString()}
          </strong>
        </span>
        <Button
          title="Go to next page"
          size="small"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          {'next >'}
        </Button>
        <Button
          title="Go to last page"
          size="small"
          onClick={() => table.lastPage()}
          disabled={!table.getCanNextPage()}
        >
          {'last >>'}
        </Button>
        <StyledSelect
          size="small"
          value={table.getState().pagination.pageSize}
          onChange={value => table.setPageSize(Number(value))}
        >
          {[20, 40, 60, 100, 150].map(pageSize => (
            <Select.Option key={pageSize} value={pageSize}>
              Show {pageSize}
            </Select.Option>
          ))}
        </StyledSelect>
      </div>
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
