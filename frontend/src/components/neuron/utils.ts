import { format, parse } from "date-fns";
import { styled } from "styled-components";

type AnyDate = Date | undefined | null;

export const yyyyMMddHHmmss = "yyyyMMddHHmmss";
export const yyyyMMdd = "yyyy-MM-dd";

export const getDateFromStrInFormat = (
  date: string,
  format: string
): Date | undefined => {
  try {
    return parse(date, format, new Date());
  } catch (e) {
    return undefined;
  }
};

/**
 * Parse given string into date object, expected format {@link yyyyMMddHHmmss}
 *
 * @param date string value
 * @returns parsed date value, or current date if the value can't be parsed
 */
export const getDateFromStr = (date = ""): Date => {
  return getDateFromStrInFormat(date, yyyyMMddHHmmss) || new Date();
};

export const getGoodFormatted = (date?: string): string => {
  if (date) {
    const dateValue = getDateFromStr(date);
    if (dateValue) {
      return format(dateValue, yyyyMMdd);
    }
  }
  return "";
};

export const getTimeStamp = (dateValue: AnyDate): string => {
  const stamp = format(dateValue || new Date(), yyyyMMddHHmmss);
  return stamp;
};

export const getStringToNumber = (dateStr: string): string => {
  try {
    const now = new Date();
    const ognoo = new Date(dateStr);
    ognoo.setHours(now.getHours());
    ognoo.setMinutes(now.getMinutes());
    ognoo.setSeconds(now.getSeconds());
    return format(ognoo, yyyyMMddHHmmss);
  } catch (e) {
    return getTimeStamp(new Date());
  }
};

export const isEqual = (date1: AnyDate, date2: AnyDate): boolean => {
  try {
    return (
      date1?.getFullYear() === date2?.getFullYear() &&
      date1?.getMonth() === date2?.getMonth() &&
      date1?.getDate() === date2?.getDate()
    );
  } catch (e) {
    return date1 === date2;
  }
};

export const Anchor = styled.div`
  position: fixed;
  right: 2%;
  bottom: 5%;
`;

export const empty: Neuron = {
  title: "",
  detail: "",
  memo: {},
  created: getTimeStamp(new Date()),
};

export const compareNeurons = (a: Neuron, b: Neuron) => {
  if (a.created == undefined && b.created == undefined) return 0;
  if (a.created == undefined) return 1;
  if (b.created == undefined) return -1;
  return +b.created - +a.created;
};
