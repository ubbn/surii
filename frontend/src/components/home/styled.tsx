import styled from "styled-components";

const StreakTableStyled = styled.div`
  table {
    border: 1px solid lightgray;
    width: 100%;
    font-size: 14px;
  }

  th,
  tr,
  td {
    border: 1px solid lightgray;
    padding: 1px 2px;
  }

  th {
    background: #f5f5f5;
    color: brown;
    cursor: pointer;
    text-align: left;
    white-space: nowrap;
    padding: 0 8px;
  }

  td {
    padding: 0 8px;
  }

  tr:hover td {
    background-color: #f5f5f5;
    color: #7700ff;
  }

  td.rank-gold {
    background-color: #ffd700;
  }

  tr:hover td.rank-gold {
    background-color: #e6c200;
  }

  td.rank-silver {
    background-color: #c0c0c0;
  }

  tr:hover td.rank-silver {
    background-color: #a8a8a8;
  }

  td.rank-bronze {
    background-color: #cd7f32;
  }

  tr:hover td.rank-bronze {
    background-color: #b5702c;
  }

  tr.current-streak td {
    background-color: #e685cc;
  }

  tr.current-streak:hover td {
    background-color: #99d18f;
  }

  .ant-btn,
  .ant-select {
    border-radius: 1px;
  }
`;

export default StreakTableStyled;
