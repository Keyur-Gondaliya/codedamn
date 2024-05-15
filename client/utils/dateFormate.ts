export function getTimeDifference(inputTime: string): {
  format: string;
  count: number;
} {
  const inputDate = new Date(inputTime);
  const currentDate = new Date();

  const timeDifference = currentDate.getTime() - inputDate.getTime();

  const millisecondsPerSecond = 1000;
  const millisecondsPerMinute = millisecondsPerSecond * 60;
  const millisecondsPerHour = millisecondsPerMinute * 60;
  const millisecondsPerDay = millisecondsPerHour * 24;
  const millisecondsPerWeek = millisecondsPerDay * 7;
  const millisecondsPerMonth = millisecondsPerDay * 30; // Assuming a month has 30 days
  const millisecondsPerYear = millisecondsPerDay * 365; // Assuming a year has 365 days

  const seconds = Math.floor(timeDifference / millisecondsPerSecond);
  const minutes = Math.floor(timeDifference / millisecondsPerMinute);
  const hours = Math.floor(timeDifference / millisecondsPerHour);
  const days = Math.floor(timeDifference / millisecondsPerDay);
  const weeks = Math.floor(timeDifference / millisecondsPerWeek);
  const months = Math.floor(timeDifference / millisecondsPerMonth);
  const years = Math.floor(timeDifference / millisecondsPerYear);

  if (seconds < 60) {
    return { format: seconds == 1 ? "secound" : "seconds", count: seconds };
  } else if (minutes < 60) {
    return { format: minutes == 1 ? "minute" : "minutes", count: minutes };
  } else if (hours < 24) {
    return { format: hours == 1 ? "hour" : "hours", count: hours };
  } else if (days < 7) {
    return { format: days == 1 ? "day" : "days", count: days };
  } else if (weeks < 4) {
    return { format: weeks == 1 ? "week" : "weeks", count: weeks };
  } else if (months < 12) {
    return { format: months == 1 ? "month" : "months", count: months };
  } else {
    return { format: years == 1 ? "year" : "years", count: years };
  }
}
