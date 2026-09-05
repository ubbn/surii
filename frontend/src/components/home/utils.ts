import { addDays, differenceInCalendarDays, format } from "date-fns";
import { getDateFromStr } from "../neuron/utils";

export type Streak = {
  rank: number;
  length: number;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
};

/**
 * Given a sorted (ascending) list of unique "yyyy-MM-dd" day strings,
 * find all continuous day streaks and return them sorted by length descending.
 *
 * @param days unique day strings in "yyyy-MM-dd" format, any order
 * @returns list of streaks sorted by length desc, each with start/end date
 */
export const getStreaksFromDays = (days: string[]): Streak[] => {
  const uniqueSortedDays = Array.from(new Set(days)).sort();
  if (uniqueSortedDays.length === 0) {
    return [];
  }

  type UnrankedStreak = Omit<Streak, "rank" | "isCurrent">;
  const streaks: UnrankedStreak[] = [];
  let streakStart = uniqueSortedDays[0];
  let streakEnd = uniqueSortedDays[0];

  for (let i = 1; i < uniqueSortedDays.length; i++) {
    const previous = new Date(streakEnd);
    const current = new Date(uniqueSortedDays[i]);

    if (differenceInCalendarDays(current, previous) === 1) {
      streakEnd = uniqueSortedDays[i];
    } else {
      streaks.push({
        length: differenceInCalendarDays(new Date(streakEnd), new Date(streakStart)) + 1,
        startDate: streakStart,
        endDate: streakEnd,
      });
      streakStart = uniqueSortedDays[i];
      streakEnd = uniqueSortedDays[i];
    }
  }

  streaks.push({
    length: differenceInCalendarDays(new Date(streakEnd), new Date(streakStart)) + 1,
    startDate: streakStart,
    endDate: streakEnd,
  });

  const latestEndDate = streaks.reduce(
    (latest, streak) => (streak.endDate > latest ? streak.endDate : latest),
    streaks[0].endDate
  );

  return streaks
    .sort((a, b) => b.length - a.length)
    .map((streak, i) => ({
      ...streak,
      rank: i + 1,
      isCurrent: streak.endDate === latestEndDate,
    }));
};

/**
 * Compute continuous day streaks of neurons being added, based on each
 * neuron's `created` timestamp.
 *
 * @param data all neurons
 * @returns streaks sorted by length desc
 */
export const getAddedStreaks = (data: Neuron[]): Streak[] => {
  const days = (Array.isArray(data) ? data : [])
    .filter((v) => v.created)
    .map((v) => format(getDateFromStr(v.created), "yyyy-MM-dd"));
  return getStreaksFromDays(days);
};

/**
 * Compute continuous day streaks of neurons being studied, based on the
 * days derived from each neuron's `memo` (offsets from its `created` date).
 *
 * @param data all neurons
 * @returns streaks sorted by length desc
 */
export const getStudiedStreaks = (data: Neuron[]): Streak[] => {
  const days: string[] = [];
  (Array.isArray(data) ? data : [])
    .filter((v) => v.created && v.memo)
    .forEach((v) => {
      const created = getDateFromStr(v.created);
      Object.keys(v.memo).forEach((day) => {
        const studiedDate = addDays(created, +day);
        days.push(format(studiedDate, "yyyy-MM-dd"));
      });
    });
  return getStreaksFromDays(days);
};
