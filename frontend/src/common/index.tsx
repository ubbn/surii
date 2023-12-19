import styled from "styled-components";
import ToolTip from "./tooltip";
import HeatMap from "./HeatMap";

export const FlexRow = styled.div`
  display: flex;
  flex-direction: row;
`;

export const FlexColumn = styled.div`
  display: flex;
  flex-direction: column;
`;

export const Good = styled.div`
  color: green;
`;

export const Bad = styled.div`
  color: red;
`;

export const BASE_COLOR = "#1677ff";

export { ToolTip, HeatMap };
