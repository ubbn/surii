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
import {
  setEndtDate,
  setActiveChip,
  setStartDate,
} from "../../redux/periodSlice";

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
  const [visibleAdded, setVisibleAdded] = useState<Neuron[]>([]);
  const [visibleStudied, setVisibleStudied] = useState<string[]>([]);
  const [addedDate, setAddedDate] = useState<string>("");
  const [studiedDate, setStudiedDate] = useState<string>("");
  const activeChip = useSelector((v: RootState) => v.period.periodIndex);
  const startDate = useSelector((v: RootState) => v.period.startDate);
  const endDate = useSelector((v: RootState) => v.period.endDate);
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
    dispatch(setStartDate(new Date(range[0] + "-01")));
    dispatch(setEndtDate(lastDayOfMonth(new Date(range[1] + "-01"))));
    dispatch(setActiveChip(undefined));
  };

  const onClickChip = (chipIndex: number) => {
    dispatch(setActiveChip(chipIndex));
    const result = chips[chipIndex].func();
    dispatch(setStartDate(result.startDate));
    dispatch(setEndtDate(result.endDate));
    setAddedDate("");
    setStudiedDate("");
  };

  const onClickAdded = (param: any) => {
    if (param?.date) {
      const clicked = param.date.replaceAll("-", ""); // yyyy/MM/dd => yyyyMMdd
      setVisibleAdded(
        items.filter((v: any) => `${v.created}`?.startsWith(clicked))
      );
    }
    setAddedDate(param.date);
    setStudiedDate("");
  };

  const onClickStudied = (param: any) => {
    const found = neuronsSolid.find((v: any) => v.date === param?.date);
    if (found) {
      setVisibleStudied(found.words);
    }
    setStudiedDate(param.date);
    setAddedDate("");
  };

  return (
    <Container>
      <div style={{ width: "100%" }}>
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
          tipText={"word(s)"}
          startDate={startDate}
          endDate={endDate}
          onClick={onClickAdded}
        />
        <strong>Neurons studied</strong>
        <HeatMap
          data={neuronsSolid}
          classForValue={greenScalClasses}
          tipText={"word(s)"}
          startDate={startDate}
          endDate={endDate}
          onClick={onClickStudied}
        />
        {addedDate && (
          <div>
            <strong>On {addedDate}, you added:</strong>
            <ul>
              {visibleAdded.map((v, i) => (
                <li key={i}>
                  {v.title} - {v.detail}
                </li>
              ))}
              {visibleAdded.length === 0 && <li>Nothing ... 😢</li>}
            </ul>
          </div>
        )}
        {studiedDate && (
          <div>
            <strong>On {studiedDate}, you studied:</strong>
            <ul>
              {visibleStudied.map((v, i) => (
                <li key={i}>{v}</li>
              ))}
              {visibleStudied.length === 0 && <li>Nothing ... 😭</li>}
            </ul>
          </div>
        )}
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
