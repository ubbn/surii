import { addDays, format, isBefore, lastDayOfMonth, subMonths } from "date-fns";

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

export const getCurrentYear = () => {
  const today = new Date();
  const startDate = new Date(today.getFullYear(), 0, 1);
  const endDate = new Date(today.getFullYear(), 11, 31);
  return { startDate, endDate };
};

export const getLastXMonths = (months: number) => {
  const today = new Date();
  const last = subMonths(today, months - 1);
  const startDate = new Date(last.getFullYear(), last.getMonth(), 1);
  const endDate = lastDayOfMonth(today);
  return { startDate, endDate };
};
