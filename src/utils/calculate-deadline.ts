import { addDays, addMilliseconds } from "date-fns";

/**
 * Calculates the deadline by adding duration (in days) and optional freezedTime (TimeSpan)
 * to the startedAt (DateTimeOffset).
 * * @param startedAt The initial date/time string (DateTimeOffset).
 * @param duration The number of days to add (int).
 * @param freezedTime The optional TimeSpan string (e.g., "00:00:00.000").
 * @returns The calculated deadline date object.
 */
export const calculateDeadline = (startedAt: string, duration: number, freezedTime?: string): Date => {
  let deadlineDate = new Date(startedAt);

  // 1. Add the duration (in days)
  deadlineDate = addDays(deadlineDate, duration || 0);

  // 2. Add the optional FreezedTime (TimeSpan)
  if (freezedTime) {
    // A TimeSpan string (like "HH:MM:SS.mmm") can be parsed to milliseconds.
    // However, since JavaScript doesn't have a native TimeSpan, a common way
    // to handle this from a C# or similar backend is to convert the TimeSpan
    // into its total number of milliseconds.

    // Assuming the backend provides the FreezedTime as an ISO duration string
    // or a string that can be reliably parsed (e.g., if it's the total milliseconds
    // represented as a string), or a structured object.

    // If the FreezedTime is a standard C# 'hh:mm:ss.ff' string, you'll need a parsing utility.
    // For simplicity and common practice in this scenario, let's create a basic parser
    // that assumes the format "HH:MM:SS" or similar, which you might need to adjust.

    const timeComponents = freezedTime.split(":").map(Number);

    if (timeComponents.length >= 3) {
      const hours = timeComponents[0] || 0;
      const minutes = timeComponents[1] || 0;
      // Handle seconds and optional milliseconds after the decimal
      const secondsParts = timeComponents[2].toString().split(".");
      const seconds = Number(secondsParts[0]) || 0;
      const milliseconds = Number(secondsParts[1]?.padEnd(3, "0")) || 0;

      const totalMilliseconds = hours * 60 * 60 * 1000 + minutes * 60 * 1000 + seconds * 1000 + milliseconds;

      deadlineDate = addMilliseconds(deadlineDate, totalMilliseconds);
    }
    // NOTE: This parsing logic for FreezedTime needs to be **verified** against
    // the exact string format your backend sends for the C# TimeSpan.
    // A safer alternative is to have the backend send FreezedTime as a **total milliseconds integer**.
  }

  return deadlineDate;
};
