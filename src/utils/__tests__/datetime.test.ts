import {
  formatUtcAttributeTimestamp,
  formatUtcDateTime,
  formatUtcDateTimeRange,
  formatUtcTime,
  ordinalSuffix,
  to12Hour,
} from "../datetime";

describe("to12Hour", () => {
  test("should format morning hours", () => {
    expect(to12Hour(7, "00")).toBe("7:00 AM UTC");
  });

  test("should format afternoon hours", () => {
    expect(to12Hour(21, "00")).toBe("9:00 PM UTC");
  });

  test("should format noon as 12 PM", () => {
    expect(to12Hour(12, "00")).toBe("12:00 PM UTC");
  });

  test("should format midnight as 12 AM", () => {
    expect(to12Hour(0, "00")).toBe("12:00 AM UTC");
  });
});

describe("formatUtcAttributeTimestamp", () => {
  test("should append UTC and trim the raw attribute value", () => {
    expect(formatUtcAttributeTimestamp("  10:20 AM  ")).toBe("10:20 AM UTC");
  });

  test("should return undefined for missing values", () => {
    expect(formatUtcAttributeTimestamp(undefined)).toBeUndefined();
    expect(formatUtcAttributeTimestamp(null)).toBeUndefined();
    expect(formatUtcAttributeTimestamp("")).toBeUndefined();
  });
});

describe("ordinalSuffix", () => {
  test("should return 'st' for 1, 21, 31", () => {
    expect(ordinalSuffix(1)).toBe("st");
    expect(ordinalSuffix(21)).toBe("st");
    expect(ordinalSuffix(31)).toBe("st");
  });

  test("should return 'nd' for 2, 22", () => {
    expect(ordinalSuffix(2)).toBe("nd");
    expect(ordinalSuffix(22)).toBe("nd");
  });

  test("should return 'rd' for 3, 23", () => {
    expect(ordinalSuffix(3)).toBe("rd");
    expect(ordinalSuffix(23)).toBe("rd");
  });

  test("should return 'th' for 4-20 and other numbers", () => {
    expect(ordinalSuffix(4)).toBe("th");
    expect(ordinalSuffix(11)).toBe("th");
    expect(ordinalSuffix(12)).toBe("th");
    expect(ordinalSuffix(13)).toBe("th");
    expect(ordinalSuffix(20)).toBe("th");
    expect(ordinalSuffix(30)).toBe("th");
  });
});

describe("formatUtcTime", () => {
  test("should format a valid afternoon time", () => {
    expect(formatUtcTime("15:00 UTC")).toBe("3:00 PM UTC");
  });

  test("should format midnight", () => {
    expect(formatUtcTime("00:00 UTC")).toBe("12:00 AM UTC");
  });

  test("should format noon", () => {
    expect(formatUtcTime("12:00 UTC")).toBe("12:00 PM UTC");
  });

  test("should return null for invalid hour", () => {
    expect(formatUtcTime("24:00 UTC")).toBeNull();
  });

  test("should return null for invalid minutes", () => {
    expect(formatUtcTime("12:60 UTC")).toBeNull();
  });

  test("should return null for text that does not match the pattern", () => {
    expect(formatUtcTime("30 August 2026 | 21:00 UTC")).toBeNull();
  });
});

describe("formatUtcDateTime", () => {
  test("should format a valid date and time, including weekday and ordinal suffix", () => {
    expect(formatUtcDateTime("30 August 2026 | 21:00 UTC")).toBe(
      "Sunday, August 30th at 9:00 PM UTC"
    );
  });

  test("should compute the correct weekday for a different date", () => {
    expect(formatUtcDateTime("1 September 2026 | 07:00 UTC")).toBe(
      "Tuesday, September 1st at 7:00 AM UTC"
    );
  });

  test("should return null for an invalid month name", () => {
    expect(formatUtcDateTime("30 Augustus 2026 | 21:00 UTC")).toBeNull();
  });

  test("should return null for invalid hour", () => {
    expect(formatUtcDateTime("30 August 2026 | 24:00 UTC")).toBeNull();
  });

  test("should return null for invalid minutes", () => {
    expect(formatUtcDateTime("30 August 2026 | 21:60 UTC")).toBeNull();
  });

  test("should return null for a day that does not exist in the given month (31 February)", () => {
    expect(formatUtcDateTime("31 February 2026 | 21:00 UTC")).toBeNull();
  });

  test("should return null for a day of 0", () => {
    expect(formatUtcDateTime("0 August 2026 | 21:00 UTC")).toBeNull();
  });

  test("should return null for February 29th in a non-leap year", () => {
    expect(formatUtcDateTime("29 February 2026 | 21:00 UTC")).toBeNull();
  });

  test("should format February 29th in a leap year", () => {
    expect(formatUtcDateTime("29 February 2028 | 21:00 UTC")).toBe(
      "Tuesday, February 29th at 9:00 PM UTC"
    );
  });

  test("should return null for text that does not match the pattern", () => {
    expect(formatUtcDateTime("15:00 UTC")).toBeNull();
  });
});

describe("formatUtcDateTimeRange", () => {
  test("should format a valid date with a start and end time", () => {
    expect(
      formatUtcDateTimeRange("5 September 2026 | 14:00 UTC", "19:30 UTC")
    ).toBe("Saturday, September 5th | 02:00 PM - 07:30 PM UTC");
  });

  test("should pad single-digit hours with a leading zero", () => {
    expect(
      formatUtcDateTimeRange("1 September 2026 | 07:00 UTC", "09:15 UTC")
    ).toBe("Tuesday, September 1st | 07:00 AM - 09:15 AM UTC");
  });

  test("should return null for an invalid end time", () => {
    expect(
      formatUtcDateTimeRange("5 September 2026 | 14:00 UTC", "25:00 UTC")
    ).toBeNull();
  });

  test("should return null when the start time does not match the pattern", () => {
    expect(formatUtcDateTimeRange("14:00 UTC", "19:30 UTC")).toBeNull();
  });
});
