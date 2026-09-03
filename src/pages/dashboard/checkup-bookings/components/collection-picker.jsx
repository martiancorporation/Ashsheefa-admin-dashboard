import { useMemo } from "react";
import { Label } from "@/components/ui/label";
import {
  COLLECTION_DAYS,
  COLLECTION_SLOTS,
  formatTime,
  isOfferedSlot,
  toLocalDateStr,
} from "./constants";

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

    const currentStr = current && !isNaN(current.getTime()) ? toLocalDateStr(current) : "";

    return days.map((d) => {
      const value = toLocalDateStr(d);
      return {
        value,
        // The site labels the first cell "Today" and greys it out — same-day
        // collection isn't bookable. A booking already on today stays
        // selectable so editing it can't move the patient off their own slot.
        label: value === todayStr ? "Today" : d.toLocaleString("default", { weekday: "short" }),
        day: d.getDate(),
        month: d.toLocaleString("default", { month: "short" }),
        isPast: d < today,
        disabled: value === todayStr && value !== currentStr,
      };
    });
  }, [currentDate]);

  // A time outside the offered window was never bookable, so it isn't offered
  // back — the admin has to move the booking onto a real slot.
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
            This booking is stored at {formatTime(staleTime)}, outside the
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
              {formatTime(slot)}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
