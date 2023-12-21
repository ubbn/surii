import { DatePicker, Space, Tag } from "antd";
import { lastDayOfMonth } from "date-fns";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { styled } from "styled-components";
import { HeatMap, ToolTip } from "../../common";
import { thunkFetchNeurons } from "../../redux/neuronSlice";
import { RootState, useAppDispatch } from "../../redux/store";
import {
  getCurrentYear,
  getLastXMonths,
  greenScalClasses,
  getNewNeurons,
  getSolidNeurons,
} from "./utils";

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
  const [neuronsAdded, setNeuronsAdded] = useState<any[]>([]);
  const [neuronsSolid, setNeuronsSolid] = useState<any[]>([]);
  const [activeChip, setActiveChip] = useState<number | undefined>(0);
  const [startDate, setStartDate] = useState<Date>(new Date("2023-01-01"));
  const [endDate, setEndDate] = useState<Date>(new Date("2023-12-31"));
  const { items } = useSelector((v: RootState) => v.neuron);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(thunkFetchNeurons());
  }, []);

  useEffect(() => {
    setNeuronsAdded(getNewNeurons(startDate, endDate, items));
    setNeuronsSolid(getSolidNeurons(startDate, endDate, items));
  }, [items, startDate, endDate]);

  const onRangeChange = (_: any, range: string[]) => {
    setStartDate(new Date(range[0] + "-01"));
    setEndDate(lastDayOfMonth(new Date(range[1] + "-01")));
    setActiveChip(undefined);
  };

  const onClickChip = (chipIndex: number) => {
    setActiveChip(chipIndex);
    const result = chips[chipIndex].func();
    setStartDate(result.startDate);
    setEndDate(result.endDate);
  };

  return (
    <Container>
      <div style={{ height: 50, width: "100%", marginRight: 20 }}>
        <div style={{ margin: "5px 0 15px 5px" }}>
          <Space size={[0, 8]} wrap>
            {chips.map((v, i) => (
              <Chip
                key={i}
                onClick={() => onClickChip(i)}
                color={activeChip === i ? "processing" : "default"}
              >
                {v.label}
              </Chip>
            ))}
          </Space>
          <ToolTip text="Choose custom range" placement="right" color="black">
            <RangePicker
              picker="month"
              size="small"
              onChange={onRangeChange}
              value={[dayjs(startDate), dayjs(endDate)]}
            />
          </ToolTip>
        </div>
        <p>
          <strong>Neurons added</strong>
        </p>
        <HeatMap
          data={neuronsAdded}
          classForValue={greenScalClasses}
          title={"Days you added new neurons"}
          mapper={(v: any) => ({ date: v.date, count: v.minutes })}
          tipText={"word(s)"}
          startDate={startDate}
          endDate={endDate}
        />
        <strong>Neurons studied</strong>
        <HeatMap
          data={neuronsSolid}
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

const Chip = styled(Tag)`
  cursor: pointer;
`;

const chips = [
  {
    label: "This year",
    func: () => getCurrentYear(),
  },
  {
    label: "Last 3 months",
    func: () => getLastXMonths(3),
  },
  {
    label: "Last 6 months",
    func: () => getLastXMonths(6),
  },
  {
    label: "Last 12 months",
    func: () => getLastXMonths(12),
  },
];
