import { useMemo } from "react";
import { Label } from "@/components/ui/label";

export const COLLECTION_SLOTS = [
  "07:00",
  "07:30",
  "08:00",
  "08:30",
  "09:00",
  "09:30",
  "10:00",
];

// The site shows today plus the next six days, with today itself not bookable.
export const COLLECTION_DAYS = 7;

export const isOfferedSlot = (time) => COLLECTION_SLOTS.includes(time);

// Home collection isn't offered yet — kept in the model so bookings that
// already carry it still read correctly, but not selectable.
export const COLLECTION_TYPES = [
  { value: "hospital", label: "Hospital visit", disabled: false },
  { value: "home", label: "Home collection", disabled: true },
];

// Local YYYY-MM-DD — toISOString() would shift the date backwards in IST.
const toLocalDateStr = (date) => {
  const d = new Date(date);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate()
  ).padStart(2, "0")}`;
};

// Slots are stored 24h ("08:30") — show them the way reception reads them.
const formatSlot = (time) => {
  if (!time) return "";
  const [h, m] = String(time).split(":").map(Number);
  if (isNaN(h)) return time;
  const suffix = h >= 12 ? "PM" : "AM";
  const hr = h % 12 || 12;
  return `${hr}:${String(m || 0).padStart(2, "0")} ${suffix}`;
};

export function CollectionPicker({
  date,
  time,
  onDateChange,
  onTimeChange,
  currentDate,
  currentTime,
  dateLabel = "Collection Date",
  timeLabel = "Collection Time",
  dateRequired = false,
}) {
  const dateStrip = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayStr = toLocalDateStr(today);

    const days = [...Array(COLLECTION_DAYS)].map((_, i) => {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      return d;
    });

    const current = currentDate ? new Date(currentDate) : null;
    if (current && !isNaN(current.getTime())) {
      current.setHours(0, 0, 0, 0);
      if (current < today) days.unshift(current);
    }

    const currentStr =
      current && !isNaN(current.getTime()) ? toLocalDateStr(current) : "";

    return days.map((d) => {
      const value = toLocalDateStr(d);
      return {
        value,
        label:
          value === todayStr
            ? "Today"
            : d.toLocaleString("default", { weekday: "short" }),
        day: d.getDate(),
        month: d.toLocaleString("default", { month: "short" }),
        isPast: d < today,
        disabled: value === todayStr && value !== currentStr,
      };
    });
  }, [currentDate]);

  const staleTime = currentTime && !isOfferedSlot(currentTime) ? currentTime : "";

  return (
    <>
      <div>
        <Label className="text-sm font-medium">
          {dateLabel}
          {dateRequired && <span className="text-red-500"> *</span>}
        </Label>
        <div className="flex flex-wrap gap-2 mt-2">
          {dateStrip.map((d) => (
            <button
              key={d.value}
              type="button"
              disabled={d.disabled}
              onClick={() => onDateChange(d.value)}
              className={`px-3 py-2 rounded-xl border text-center leading-tight
                ${
                  date === d.value
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white border-slate-200 hover:border-blue-300"
                }
                ${d.disabled ? "opacity-40 cursor-not-allowed hover:border-slate-200" : ""}
                ${d.isPast && !d.disabled ? "opacity-60" : ""}`}
            >
              <span className="block text-[11px]">{d.label}</span>
              <span className="block text-base font-semibold">{d.day}</span>
              <span className="block text-[11px]">{d.month}</span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <Label className="text-sm font-medium">{timeLabel}</Label>
        {staleTime && (
          <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-md px-2 py-1.5 mt-2">
            This booking is stored at {formatSlot(staleTime)}, outside the
            collection window — pick a slot below to correct it.
          </p>
        )}
        <div className="grid grid-cols-4 gap-2 mt-2">
          {COLLECTION_SLOTS.map((slot) => (
            <button
              key={slot}
              type="button"
              onClick={() => onTimeChange(slot)}
              className={`py-2 rounded-xl text-xs font-semibold border
                ${
                  time === slot
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white border-slate-200 hover:border-blue-400"
                }`}
            >
              {formatSlot(slot)}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
