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
        } else if (timeframe === "30days") {
            return dailyData || []
        } else if (timeframe === "7days") {
            return (dailyData || []).slice(-7)
        }
        return []
    }, [data, dailyData, timeframe])

    return (
        <Card className="shadow-none py-4">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div>
                    <CardTitle>Enquiries vs Appointments</CardTitle>
                    <CardDescription>
                        {timeframe === "monthly" 
                            ? "Monthly comparison of enquiries and appointments" 
                            : "Daily comparison of enquiries and appointments"}
                    </CardDescription>
                </div>
                <Select value={timeframe} onValueChange={setTimeframe}>
                    <SelectTrigger className="w-[130px] h-9">
                        <SelectValue placeholder="Timeframe" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="30days">Last 30 Days</SelectItem>
                        <SelectItem value="7days">Last 7 Days</SelectItem>
                    </SelectContent>
                </Select>
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
                            tickFormatter={(value) => timeframe === "monthly" ? value.slice(0, 3) : value}
                        />
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent indicator="dashed" />}
                        />
                        <Bar dataKey="enquiries" fill="var(--color-enquiries)" radius={4} />
                        <Bar dataKey="appointments" fill="var(--color-appointments)" radius={4} />
                    </BarChart>
                </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col items-start gap-2 text-sm">
                <div className="flex gap-2 leading-none font-medium">
                    Track patient engagement trends <TrendingUp className="h-4 w-4" />
                </div>
                <div className="text-muted-foreground leading-none">
                    {timeframe === "monthly" 
                        ? "Monthly data comparison for recent 6 months" 
                        : timeframe === "30days" 
                        ? "Daily data comparison for the last 30 days" 
                        : "Daily data comparison for the last 7 days"}
                </div>
            </CardFooter>
        </Card>
    )
}
