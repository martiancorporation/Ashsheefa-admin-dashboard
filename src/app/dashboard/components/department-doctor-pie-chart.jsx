"use client"

import { TrendingUp } from "lucide-react"
import { Cell, Pie, PieChart } from "recharts"

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"

export const description = "A pie chart showing doctor distribution by department"

// Blue color palette similar to the image
const BLUE_COLORS = [
    "#60A5FA", // Light blue (largest segment)
    "#3B82F6", // Medium blue
    "#2563EB", // Royal blue
    "#1D4ED8", // Dark blue
    "#1E40AF", // Darker blue
    "#1E3A8A", // Very dark blue
    "#1D2B5B", // Darkest blue
    "#0F172A", // Almost black blue
    "#0C4A6E", // Deep blue
    "#075985", // Navy blue
    "#0369A1", // Steel blue
]

const chartConfig = {
    value: {
        label: "Doctors",
    },
}

export function DepartmentDoctorPieChart({ data = [] }) {
    return (
        <Card className="flex flex-col shadow-none py-4">
            <CardHeader className="items-center pb-0">
                <CardTitle>Department - Doctor Chart</CardTitle>
                <CardDescription>Doctor Distribution by Department</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 pb-0">
                <ChartContainer
                    config={chartConfig}
                    className="[&_.recharts-pie-label-text]:fill-black [&_.recharts-pie-label-line]:stroke-gray-400 mx-auto aspect-square max-h-[250px] pb-0"
                >
                    <PieChart className="bg-white">
                        <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                        <Pie data={data} dataKey="value" label nameKey="name">
                            {data.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={BLUE_COLORS[index % BLUE_COLORS.length]}
                                />
                            ))}
                        </Pie>
                    </PieChart>
                </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col gap-2 text-sm">
                <div className="flex items-center gap-2 leading-none font-medium">
                    Department coverage analysis <TrendingUp className="h-4 w-4" />
                </div>
                <div className="text-muted-foreground leading-none">
                    Total doctors: <span className="font-medium text-black">{data.reduce((sum, item) => sum + item.value, 0)}</span>
                </div>
            </CardFooter>
        </Card>
    )
}
