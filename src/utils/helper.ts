import { TrackType } from "@/sharedTypes/sharedTypes";

export function getUniqueValuesByKey(
  arr: TrackType[],
  key: keyof TrackType,
): string[] {
  const uniqueValues = new Set<string>();

  arr.forEach((item) => {
    const value = item[key];

    if (Array.isArray(value)) {
      // Для genre (string[])
      value.forEach((v) => {
        if (typeof v === 'string' && v) {
          uniqueValues.add(v);
        }
      });
    } else if (typeof value === 'string' && value) {
      // Для author, name, album, release_date
      uniqueValues.add(value);
    } else if (typeof value === 'number') {
      // Для _id, duration_in_seconds
      uniqueValues.add(String(value));
    }
    // Пропускаем null (logo) и starred_user (number[])
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