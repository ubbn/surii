import { Tooltip as AntTooltip } from "antd";
import { TooltipPlacement } from "antd/es/tooltip";
import { ReactElement } from "react";
import { BASE_COLOR } from ".";

const ToolTip = ({
  children,
  text,
  placement = "left",
  color = BASE_COLOR,
}: {
  children: ReactElement;
  text: string;
  placement?: TooltipPlacement;
  color?: string;
}) => {
  return (
    <AntTooltip title={text} placement={placement} color={color}>
      {children}
    </AntTooltip>
  );
};

export default ToolTip;
