import { TrackType } from "@/sharedTypes/sharedTypes";

export function getUniqueValuesByKey(
  arr: TrackType[],
  key: keyof TrackType,
): string[] {
  const uniqueValues = new Set<string>();

  arr.forEach((item) => {
    const value = item[key];

    if (Array.isArray(value)) {
      value.forEach((v) => {
        if (v) {
          uniqueValues.add(String(v)); // ← Добавлено String() для string[]
        }
      });
    } else if (typeof value === 'string') {
      uniqueValues.add(value);
    } else if (typeof value === 'number') {
      uniqueValues.add(String(value)); // ← Добавлено для number (_id, duration_in_seconds)
    }
  });

  return Array.from(uniqueValues);
}

export function formatTime(time: number) {
  const minutes = Math.floor(time / 60);
  const inputSeconds = Math.floor(time % 60);
  const outputSeconds = inputSeconds < 10 ? `0${inputSeconds}` : inputSeconds;

  return `${minutes}:${outputSeconds}`;
}

export const getTimePanel = (currentTime: number, totalTime: number | undefined) => {
  return `${formatTime(currentTime)} / ${totalTime ? formatTime(totalTime) : '--:--'}`;
};