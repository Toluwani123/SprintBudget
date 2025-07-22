import React from "react";
import { useMemo } from "react";






/** 👛 Render a money value */
export function Currency({
  amount,
  locale = "en-US",
  currency = "USD",
  className,
}) {
  const formatted = new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
  }).format(amount);

  return <span className={className}>{formatted}</span>;
}



/** 📅 Render “Jul 21” from Date | string ("2025‑07‑21") */
export function ShortDate({
  date,                    // Date  |  "2025‑07‑21"  |  "2025‑07‑21T05:49:14Z"
  locale = "en-US",
  className,
  placeholder = "—",       // what to show if date is invalid
  ...timeProps
}) {
  /* ---------- Parse once, memoised ---------- */
  const parsed = useMemo(() => {
    if (!date) return null;

    // 1. Already a Date?
    if (date instanceof Date && !isNaN(date)) return date;

    if (typeof date === "string") {
      // 2. Try the native parser first (works for "2025-07-21" in all evergreen browsers)
      let d = new Date(date);
      if (!isNaN(d)) return d;

      // 3. Remove fractional seconds (".903075") if present
      d = new Date(date.replace(/\.\d+(?=Z$)/, ""));
      if (!isNaN(d)) return d;

      // 4. Try appending midnight so "YYYY‑MM‑DD" always parses
      d = new Date(`${date}T00:00:00`);
      if (!isNaN(d)) return d;
    }

    // Couldn’t parse
    return null;
  }, [date]);

  /* ---------- Graceful fallback ---------- */
  if (!parsed) {
    return (
      <time className={className} {...timeProps}>
        {placeholder}
      </time>
    );
  }

  /* ---------- Format output ---------- */
  const formatted = new Intl.DateTimeFormat(locale, {
    month: "short",
    day: "numeric",
  }).format(parsed);

  return (
    <time
      dateTime={parsed.toISOString()}
      className={className}
      {...timeProps}
    >
      {formatted}
    </time>
  );
}
