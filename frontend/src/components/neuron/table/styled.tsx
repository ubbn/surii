import { CSSProperties } from "react";
import styled from "styled-components";

export const getCellClassName = (columnId: number): string => {
  switch (columnId) {
    case 0:
      return "ognoo";
    case 1:
      return "subjectCell";
    case 2:
      return "subjectCell";
    default:
      return "memoCell";
  }
};

export const getHeaderCellStyle = (columnId: number): CSSProperties => {
  const common = {
    background: "#f5f5f5",
  };
  switch (columnId) {
    case 0:
      return {
        ...common,
        color: "brown",
        minWidth: 106,
        maxWidth: 106,
      };
    case 1:
      return {
        ...common,
        minWidth: 200,
        maxWidth: "20%",
      };
    case 2:
      return {
        ...common,
        minWidth: 100,
        maxWidth: "20%",
      };
    default:
      return {
        ...common,
        minWidth: 30,
        maxWidth: 30,
      };
  }
};

const ITableStyled = styled.div`
  table {
    border: 1px solid lightgray;
  }

  th,
  tr,
  td {
    border: 1px solid lightgray;
    padding: 1px 2px;
  }

  tr:hover td {
    background-color: #f5f5f5;
    color: #7700ff;
  }

  .subjectCell {
    cursor: pointer;
    padding: 0 8px;
  }

  .memoCell {
    text-align: center;
    cursor: pointer;
    :hover {
      background-color: #ff4136;
      border-radius: 5px;
    }
  }

  .ant-btn,
  .ant-picker {
    border-radius: 1px;
  }
`;

export default ITableStyled;
