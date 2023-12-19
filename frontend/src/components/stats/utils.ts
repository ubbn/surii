import { addDays, format, isBefore } from "date-fns";

export const prepareData = (startDate: Date, endDate: Date, data: Neuron[]) => {
  let temp = startDate;
  let endDateOffset = addDays(endDate, 1);
  const prepared = [];
  do {
    const tempStr = format(temp, "yyyyMMdd");
    const found = data.filter((v) => `${v.created}`?.startsWith(tempStr));
    prepared.push({ date: format(temp, "yyyy/MM/dd"), count: found.length });
    temp = addDays(temp, 1);
  } while (isBefore(temp, endDateOffset));
  return prepared;
};

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
