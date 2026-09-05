import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  PaginationState,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { Button, Select } from "antd";
import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import { FlexColumn } from "../../common";
import { thunkFetchNeurons } from "../../redux/neuronSlice";
import { RootState, useAppDispatch } from "../../redux/store";
import { streakColumns } from "./columns";
import StreakTableStyled from "./styled";
import { getAddedStreaks, getStudiedStreaks, Streak } from "./utils";

const Container = styled(FlexColumn)`
  gap: 30px;
  @media (min-width: 601px) {
    flex-direction: row;
    align-items: flex-start;
  }
  @media (max-width: 600px) {
    margin: 0 10px;
  }
`;

const Panel = styled(FlexColumn)`
  gap: 8px;
  @media (min-width: 601px) {
    flex: 1;
    min-width: 0;
  }
`;

const PanelHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
`;

const CurrentStreak = styled.span`
  font-weight: normal;
  opacity: 0.8;
`;

const StyledSelect = styled(Select)`
  margin-left: 5px;
  @media (max-width: 600px) {
    margin: 15px 0 0;
    width: 100%;
  }
`;

const getRankMedalClass = (rank: number): string | undefined => {
  if (rank <= 5) return "rank-gold";
  if (rank <= 10) return "rank-silver";
  if (rank <= 15) return "rank-bronze";
  return undefined;
};

const StreakTable = ({ streaks }: { streaks: Streak[] }) => {
  const [sorting, setSorting] = useState<SortingState>([
    { id: "length", desc: true },
  ]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 30,
  });

  const table = useReactTable({
    data: streaks,
    columns: streakColumns,
    state: { sorting, pagination },
    autoResetPageIndex: false,
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  if (streaks.length === 0) {
    return <div>No streaks yet ... 😢</div>;
  }

  return (
    <StreakTableStyled>
      <table>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  colSpan={header.colSpan}
                  onClick={header.column.getToggleSortingHandler()}
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
            <tr
              key={row.id}
              className={row.original.isCurrent ? "current-streak" : undefined}
            >
              {row.getVisibleCells().map((cell) => (
                <td
                  key={cell.id}
                  className={
                    cell.column.id === "rank"
                      ? getRankMedalClass(row.original.rank)
                      : undefined
                  }
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{ display: "flex", margin: "15px 0 0", flexWrap: "wrap", alignItems: "center" }}>
        <Button
          title="Go to first page"
          size="small"
          onClick={() => table.firstPage()}
          disabled={!table.getCanPreviousPage()}
        >
          {"<< first"}
        </Button>
        <Button
          title="Go to previous page"
          size="small"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          {"< prev"}
        </Button>
        <span style={{ margin: "0 10px" }}>
          <strong>
            {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount().toLocaleString()}
          </strong>
        </span>
        <Button
          title="Go to next page"
          size="small"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          {"next >"}
        </Button>
        <Button
          title="Go to last page"
          size="small"
          onClick={() => table.lastPage()}
          disabled={!table.getCanNextPage()}
        >
          {"last >>"}
        </Button>
        <StyledSelect
          size="small"
          value={table.getState().pagination.pageSize}
          onChange={(value) => table.setPageSize(Number(value))}
        >
          {[10, 20, 40, 60].map((pageSize) => (
            <Select.Option key={pageSize} value={pageSize}>
              Show {pageSize}
            </Select.Option>
          ))}
        </StyledSelect>
      </div>
    </StreakTableStyled>
  );
};

const Home = () => {
  const dispatch = useAppDispatch();
  const { items } = useSelector((v: RootState) => v.neuron);

  useEffect(() => {
    dispatch(thunkFetchNeurons());
  }, []);

  const addedStreaks = useMemo(() => getAddedStreaks(items), [items]);
  const studiedStreaks = useMemo(() => getStudiedStreaks(items), [items]);

  const currentAddedStreak = addedStreaks.find((s) => s.isCurrent);
  const currentStudiedStreak = studiedStreaks.find((s) => s.isCurrent);

  return (
    <Container>
      <Panel>
        <PanelHeader>
          <strong>New Neuron streaks</strong>
          {currentAddedStreak && (
            <CurrentStreak>
              Current: {currentAddedStreak.length} day
              {currentAddedStreak.length > 1 ? "s" : ""}
            </CurrentStreak>
          )}
        </PanelHeader>
        <StreakTable streaks={addedStreaks} />
      </Panel>
      <Panel>
        <PanelHeader>
          <strong>Study Streaks</strong>
          {currentStudiedStreak && (
            <CurrentStreak>
              Current: {currentStudiedStreak.length} day
              {currentStudiedStreak.length > 1 ? "s" : ""}
            </CurrentStreak>
          )}
        </PanelHeader>
        <StreakTable streaks={studiedStreaks} />
      </Panel>
    </Container>
  );
};

export default Home;
