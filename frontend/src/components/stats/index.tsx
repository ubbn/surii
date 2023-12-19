import { DatePicker } from "antd";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { styled } from "styled-components";
import { HeatMap, ToolTip } from "../../common";
import { thunkFetchNeurons } from "../../redux/neuronSlice";
import { RootState, useAppDispatch } from "../../redux/store";
import { greenScalClasses, prepareData } from "./utils";
import { lastDayOfMonth } from "date-fns";
import dayjs from "dayjs";

const { RangePicker } = DatePicker;

const Container = styled.div`
  width: 100%;
  max-width: 700;
  .react-calendar-heatmap {
    max-height: 160px;
  }

  // Little space between weekdays and data rectangles
  .react-calendar-heatmap-weekday-labels {
    transform: translate(5px, 14px);
  }

  & input {
    color: gray !important;
  }
`;

const Stats = () => {
  const [data, setData] = useState<any>([]);
  const [startDate, setStartDate] = useState<Date>(new Date("2023-01-01"));
  const [endDate, setEndDate] = useState<Date>(new Date("2023-12-31"));
  const { items } = useSelector((v: RootState) => v.neuron);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(thunkFetchNeurons());
  }, []);

  useEffect(() => {
    setData(prepareData(startDate, endDate, items));
  }, [items, startDate, endDate]);

  const onRangeChange = (_: any, range: string[]) => {
    setStartDate(new Date(range[0] + "-01"));
    setEndDate(lastDayOfMonth(new Date(range[1] + "-01")));
  };

  return (
    <Container>
      <div style={{ height: 50, width: "100%", marginRight: 20 }}>
        <div style={{ margin: "5px 0 15px 5px" }}>
          <ToolTip text="Choose a range">
            <RangePicker
              picker="month"
              size="small"
              onChange={onRangeChange}
              value={[dayjs(startDate), dayjs(endDate)]}
            />
          </ToolTip>
        </div>
        <HeatMap
          data={data}
          classForValue={greenScalClasses}
          title={"Days you added new neurons"}
          mapper={(v: any) => ({ date: v.date, count: v.minutes })}
          tipText={"word(s)"}
          startDate={startDate}
          endDate={endDate}
        />
      </div>
    </Container>
  );
};

export default Stats;
