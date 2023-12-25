import { subDays } from "date-fns";
import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";
import { Tooltip } from "react-tooltip";
import styled from "styled-components";

const Container = styled.div`
  .react-calendar-heatmap {
    max-height: 160px;
  }

  // Little space between weekdays and data rectangles
  .react-calendar-heatmap-weekday-labels {
    transform: translate(5px, 14px);
  }
`;

type Props = {
  startDate: Date;
  data: any[];
  tipText: any;
  [_: string]: any;
};

const HeatMap = ({ startDate, data, tipText, ...props }: Props) => {
  return (
    <Container>
      <CalendarHeatmap
        tooltipDataAttrs={(value: any) => ({
          "data-tooltip-id": "heatmap-tooltip",
          "data-tooltip-content": `${value.date}: ${value.count} ${tipText}`,
        })}
        showWeekdayLabels={true}
        values={data}
        startDate={subDays(startDate, 1)}
        {...props}
      />
      <Tooltip id="heatmap-tooltip" />
    </Container>
  );
};

export default HeatMap;
