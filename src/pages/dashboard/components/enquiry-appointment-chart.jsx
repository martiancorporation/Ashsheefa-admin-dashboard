import * as React from "react"
import { TrendingUp } from "lucide-react"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { DatePickerWithRange } from "@/components/ui/date-range-filter"

export const description = "A multiple bar chart showing enquiries vs appointments"

// Default chart data with recent 6 months
const defaultChartData = [
    { month: "July", enquiries: 0, appointments: 0 },
    { month: "August", enquiries: 0, appointments: 0 },
    { month: "September", enquiries: 0, appointments: 0 },
    { month: "October", enquiries: 0, appointments: 0 },
    { month: "November", enquiries: 0, appointments: 0 },
    { month: "December", enquiries: 0, appointments: 0 },
]

const MONTH_ABBR = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
]

/* Shortest window first, then the monthly views, then custom. The trigger is
   sized to the longest label below, so widen it if a longer one is added. */
const TIMEFRAME_OPTIONS = [
    { value: "7days", label: "Last 7 Days" },
    { value: "30days", label: "Last 30 Days" },
    { value: "90days", label: "Last 90 Days" },
    { value: "monthly", label: "Last 6 Months" },
    { value: "yearly", label: "Last 1 Year" },
    { value: "custom", label: "Custom Range" },
]

// Day-window timeframes, anchored on today rather than on the last row the API
// happened to return.
const RANGE_DAYS = { "7days": 7, "30days": 30, "90days": 90 }

const DAILY_TIMEFRAMES = ["7days", "30days", "90days", "custom"]

const parseDay = (value) => {
    const [y, m, d] = String(value).split("-").map(Number)
    return new Date(y, m - 1, d)
}

const chartConfig = {
    enquiries: {
        label: "Enquiries",
        color: "#3B8BF4",
    },
    appointments: {
        label: "Appointments",
        color: "#B4EE44",
    },
}

export function EnquiryAppointmentBarChart({ data = [], dailyData = [] }) {
    const [timeframe, setTimeframe] = React.useState("monthly")
    const [customRange, setCustomRange] = React.useState({
        from: undefined,
        to: undefined,
    })

    const isDaily = DAILY_TIMEFRAMES.includes(timeframe)

    // The daily series ends today, so the picker can't offer anything outside it.
    const dataBounds = React.useMemo(() => {
        if (!dailyData.length) return { min: undefined, max: undefined }
        return {
            min: parseDay(dailyData[0].date),
            max: parseDay(dailyData[dailyData.length - 1].date),
        }
    }, [dailyData])

    // Transform API data to match the expected format with recent months
    const chartData = React.useMemo(() => {
        if (timeframe === "monthly") {
            if (!data.length) {
                return defaultChartData
            }

            // Create a map of month names
            const monthMap = {
                'Jan': 'January', 'Feb': 'February', 'Mar': 'March', 'Apr': 'April',
                'May': 'May', 'Jun': 'June', 'Jul': 'July', 'Aug': 'August',
                'Sep': 'September', 'Oct': 'October', 'Nov': 'November', 'Dec': 'December'
            }

            // Start with default data (recent 6 months with 0 values)
            const recentMonthsData = defaultChartData.map(m => ({ ...m }))

            // Update with actual data from API
            data.forEach(item => {
                const fullMonthName = monthMap[item.month] || item.month
                const monthIndex = recentMonthsData.findIndex(month => month.month === fullMonthName)
                if (monthIndex !== -1) {
                    recentMonthsData[monthIndex].enquiries = item.enquiries || 0
                    recentMonthsData[monthIndex].appointments = item.appointments || 0
                }
            })

            return recentMonthsData
        }

        if (timeframe === "yearly") {
            // 365 daily bars would be unreadable, so a year is shown as the
            // trailing 12 months off the monthly aggregate.
            const now = new Date()
            const buckets = []
            for (let i = 11; i >= 0; i--) {
                const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
                buckets.push({
                    key: `${d.getFullYear()}-${MONTH_ABBR[d.getMonth()]}`,
                    month: MONTH_ABBR[d.getMonth()],
                    enquiries: 0,
                    appointments: 0,
                })
            }

            data.forEach(item => {
                // Older payloads carried no year; fall back to matching the
                // month alone so those still land somewhere.
                const bucket = item.year !== undefined
                    ? buckets.find(b => b.key === `${item.year}-${item.month}`)
                    : buckets.find(b => b.month === item.month)
                if (bucket) {
                    bucket.enquiries = item.enquiries || 0
                    bucket.appointments = item.appointments || 0
                }
            })

            return buckets
        }

        if (!isDaily) return []

        let start
        let end

        if (timeframe === "custom") {
            // Until a range is picked, keep showing everything rather than
            // flashing an empty chart.
            if (!customRange?.from && !customRange?.to) return dailyData || []
            start = new Date(customRange.from || dataBounds.min)
            // A single-day pick has no `to` yet; show that one day.
            end = new Date(customRange.to || customRange.from || dataBounds.max)
            if (start > end) [start, end] = [end, start]
        } else {
            const days = RANGE_DAYS[timeframe] ?? 7
            end = new Date()
            start = new Date(end)
            start.setDate(start.getDate() - (days - 1))
        }

        start.setHours(0, 0, 0, 0)
        end.setHours(23, 59, 59, 999)

        return (dailyData || []).filter(item => {
            const date = parseDay(item.date)
            return date >= start && date <= end
        })
    }, [data, dailyData, timeframe, customRange, dataBounds, isDaily])

    const footerNote = {
        monthly: "Monthly data comparison for recent 6 months",
        yearly: "Monthly data comparison for the last 12 months",
        "90days": "Daily data comparison for the last 90 days",
        "30days": "Daily data comparison for the last 30 days",
        "7days": "Daily data comparison for the last 7 days",
        custom: "Daily data comparison for the selected date range",
    }[timeframe]

    return (
        <Card className="shadow-none py-4">
            <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-2 space-y-0 pb-2">
                <div>
                    <CardTitle>Enquiries vs Appointments</CardTitle>
                    <CardDescription>
                        {isDaily
                            ? "Daily comparison of enquiries and appointments"
                            : "Monthly comparison of enquiries and appointments"}
                    </CardDescription>
                </div>
                <div className="flex flex-wrap items-center justify-end gap-2">
                    {timeframe === "custom" && (
                        <DatePickerWithRange
                            value={customRange}
                            onDateChange={setCustomRange}
                            fromDate={dataBounds.min}
                            toDate={dataBounds.max}
                            align="end"
                        />
                    )}
                    <Select value={timeframe} onValueChange={setTimeframe}>
                        <SelectTrigger className="w-[155px] h-9">
                            <SelectValue placeholder="Timeframe" />
                        </SelectTrigger>
                        <SelectContent>
                            {TIMEFRAME_OPTIONS.map(option => (
                                <SelectItem key={option.value} value={option.value}>
                                    {option.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig}>
                    <BarChart accessibilityLayer data={chartData}>
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="month"
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                            minTickGap={16}
                            tickFormatter={(value) => isDaily ? value : value.slice(0, 3)}
                        />
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent indicator="dashed" />}
                        />
                        {/* Animation off: recharts tweens from the previous series' geometry, so
                            switching timeframes left 12 monthly bars drawn as slivers
                            crammed against the y-axis. */}
                        <Bar dataKey="enquiries" fill="var(--color-enquiries)" radius={4} isAnimationActive={false} />
                        <Bar dataKey="appointments" fill="var(--color-appointments)" radius={4} isAnimationActive={false} />
                    </BarChart>
                </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col items-start gap-2 text-sm">
                <div className="flex gap-2 leading-none font-medium">
                    Track patient engagement trends <TrendingUp className="h-4 w-4" />
                </div>
                <div className="text-muted-foreground leading-none">
                    {footerNote}
                </div>
            </CardFooter>
        </Card>
    )
}
