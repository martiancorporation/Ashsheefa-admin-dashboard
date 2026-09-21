import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const EMPTY = { from: undefined, to: undefined };

export function DatePickerWithRange({
  className,
  value,
  onDateChange,
  fromDate,
  toDate,
  placeholder = "Select Date",
  triggerClassName,
  clearClassName,
  align = "start",
}) {
  const [internal, setInternal] = React.useState(EMPTY);
  const [open, setOpen] = React.useState(false);

  const isControlled = value !== undefined;
  const date = isControlled ? value || EMPTY : internal;

  const commit = (next) => {
    const range = next || EMPTY;
    if (!isControlled) setInternal(range);
    onDateChange?.(range);
  };

  const clear = (event) => {
    // The clear button sits next to the trigger, so stop it opening the popover.
    event.stopPropagation();
    commit(EMPTY);
    setOpen(false);
  };

  const label = date?.from
    ? date.to
      ? `${format(date.from, "MMM dd")} - ${format(date.to, "MMM dd, y")}`
      : format(date.from, "MMM dd, y")
    : placeholder;

  return (
    <div className={cn("flex items-center gap-1", className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "h-9 min-w-[140px] justify-start text-left text-xs font-normal",
              triggerClassName,
              // after triggerClassName so an empty range still reads as a placeholder
              !date?.from && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-1 h-3.5 w-3.5 shrink-0" />
            <span className="truncate">{label}</span>
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-auto p-0" align={align} collisionPadding={12}>
          <Calendar
            autoFocus
            mode="range"
            defaultMonth={date?.from || toDate}
            selected={date}
            onSelect={commit}
            numberOfMonths={2}
            startMonth={fromDate}
            endMonth={toDate}
            /* Separate matchers: { before, after } in ONE object is a
               DateInterval in react-day-picker and would disable the middle
               of the range instead of its outside. */
            disabled={[
              fromDate ? { before: fromDate } : null,
              toDate ? { after: toDate } : null,
            ].filter(Boolean)}
          />
          <div className="p-3 border-t">
            <Button
              onClick={() => setOpen(false)}
              className="w-full cursor-pointer"
              size="sm"
            >
              Done
            </Button>
          </div>
        </PopoverContent>
      </Popover>

      {date?.from && (
        <Button
          variant="ghost"
          size="icon"
          aria-label="Clear date range"
          onClick={clear}
          className={cn("h-9 w-9 shrink-0", clearClassName)}
        >
          <X className="h-3.5 w-3.5" />
        </Button>
      )}
    </div>
  );
}

export default DatePickerWithRange;
