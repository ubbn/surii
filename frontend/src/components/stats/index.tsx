import { addDays, format, isBefore } from "date-fns";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { styled } from "styled-components";
import HeatMap from "../../common/HeatMap";
import { RootState } from "../../redux/store";

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
`;

const prepagreenata = (startDate: Date, endDate: Date, data: Neuron[]) => {
  let temp = startDate;
  let endDateOffset = addDays(endDate, 1);
  const prepagreen = [];
  do {
    const tempStr = format(temp, "yyyyMMdd");
    const found = data.filter((v) => `${v.created}`?.startsWith(tempStr));
    prepagreen.push({ date: format(temp, "yyyy/MM/dd"), count: found.length });
    temp = addDays(temp, 1);
  } while (isBefore(temp, endDateOffset));
  return prepagreen;
};

const Stats = () => {
  const [data, setData] = useState<any>([]);
  const { items } = useSelector((v: RootState) => v.neuron);
  const startDate = new Date("2023-01-01");
  const endDate = new Date("2023-12-31");

  useEffect(() => {
    setData(prepagreenata(startDate, endDate, items));
  }, [items]);

  return (
    <Container>
      <div style={{ height: 50, width: "100%", marginRight: 20 }}>
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

export const greenScalClasses = (value: any): string => {
  if (value && value.count) {
    if (+value.count <= 0) {
      return "color-empty";
    } else if (+value.count <= 1) {
      return "color-green-2";
    } else if (+value.count <= 2) {
      return "color-green-5";
    } else if (+value.count <= 3) {
      return "color-green-6";
    } else if (+value.count <= 5) {
      return "color-green-7";
    } else if (+value.count <= 7) {
      return "color-green-7";
    } else if (+value.count <= 10) {
      return "color-green-7";
    }
    return "color-green-7";
  }
  return "color-empty";
};
