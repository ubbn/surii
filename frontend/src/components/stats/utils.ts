import {
  addDays,
  format,
  isAfter,
  isBefore,
  lastDayOfMonth,
  subMonths,
} from "date-fns";
import { getDateFromStr } from "../neuron/utils";

/**
 * Find all learned words between given range from given data
 *
 * @param startDate beginning of range
 * @param endDate end of range
 * @param data all data
 * @returns all days filled with number of words 0 - ...
 */
export const getNewNeurons = (
  startDate: Date,
  endDate: Date,
  data: Neuron[]
) => {
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

/**
 * Find days you studied neurons
 *
 * @param startDate
 * @param endDate
 * @param data
 * @returns
 */
export const getSolidNeurons = (
  startDate: Date,
  endDate: Date,
  data: Neuron[]
) => {
  const cumulatedSolid = data
    .filter((v) => v.created && v.memo && getDateFromStr(v.created))
    .reduce((acc: any, curr: Neuron) => {
      const created = getDateFromStr(curr.created);
      Object.keys(curr.memo).forEach((day) => {
        const studiedDate = addDays(created, +day);
        if (isBefore(studiedDate, endDate) && isAfter(studiedDate, startDate)) {
          const studied = format(studiedDate, "yyyy/MM/dd");
          if (acc[studied]) {
            acc[studied].push(curr.title);
          } else {
            acc[studied] = [curr.title];
          }
        }
      });
      return acc;
    }, {});

  let date = startDate;
  const endDateOffset = addDays(endDate, 1);
  const result = [];
  do {
    const tempStr = format(date, "yyyy/MM/dd");
    let count = 0;
    if (cumulatedSolid[tempStr]) {
      count = cumulatedSolid[tempStr].length;
    }
    result.push({ date, count });
    date = addDays(date, 1);
  } while (isBefore(date, endDateOffset));
  return result;
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
