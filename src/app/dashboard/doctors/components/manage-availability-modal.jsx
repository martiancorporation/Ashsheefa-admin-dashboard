"use client"

import React from "react"

import { useState } from "react"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"


export function ManageAvailabilityModal({ children, doctor, onSave }) {
    const [open, setOpen] = useState(false)
    const [schedule, setSchedule] = useState({
        monday: { enabled: doctor.availableDays.includes("Monday"), startTime: "09:00", endTime: "17:00" },
        tuesday: { enabled: doctor.availableDays.includes("Tuesday"), startTime: "09:00", endTime: "17:00" },
        wednesday: { enabled: doctor.availableDays.includes("Wednesday"), startTime: "09:00", endTime: "17:00" },
        thursday: { enabled: doctor.availableDays.includes("Thursday"), startTime: "09:00", endTime: "17:00" },
        friday: { enabled: doctor.availableDays.includes("Friday"), startTime: "09:00", endTime: "17:00" },
        saturday: { enabled: doctor.availableDays.includes("Saturday"), startTime: "09:00", endTime: "17:00" },
        sunday: { enabled: doctor.availableDays.includes("Sunday"), startTime: "09:00", endTime: "17:00" },
    })

    const timeOptions = [
        "08:00",
        "08:30",
        "09:00",
        "09:30",
        "10:00",
        "10:30",
        "11:00",
        "11:30",
        "12:00",
        "12:30",
        "13:00",
        "13:30",
        "14:00",
        "14:30",
        "15:00",
        "15:30",
        "16:00",
        "16:30",
        "17:00",
        "17:30",
        "18:00",
        "18:30",
        "19:00",
        "19:30",
        "20:00",
    ]

    const handleToggleDay = (day) => {
        setSchedule((prev) => ({
            ...prev,
            [day]: {
                ...prev[day],
                enabled: !prev[day].enabled,
            },
        }))
    }

    const handleTimeChange = (day, type, value) => {
        setSchedule((prev) => ({
            ...prev,
            [day]: {
                ...prev[day],
                [type]: value,
            },
        }))
    }

    const handleSave = () => {
        // Process the schedule data
        const availableDays = Object.entries(schedule)
            .filter(([_, value]) => value.enabled)
            .map(([day]) => day.charAt(0).toUpperCase() + day.slice(1))

        const data = { availableDays, schedule }
        console.log("Updated availability:", data)

        if (onSave) {
            onSave(data)
        }

        setOpen(false)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <div className="flex items-center">
                        <button onClick={() => setOpen(false)} className="mr-2">
                            <ArrowLeft className="h-5 w-5" />
                        </button>
                        <DialogTitle>Manage Availability</DialogTitle>
                    </div>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    {Object.entries(schedule).map(([day, { enabled, startTime, endTime }]) => (
                        <div key={day} className="border-b pb-6 last:border-0">
                            <div className="flex items-center justify-between">
                                <Label htmlFor={`${day}-toggle`} className="text-base capitalize">
                                    {day}
                                </Label>
                                <Switch
                                    id={`${day}-toggle`}
                                    checked={enabled}
                                    onCheckedChange={() => handleToggleDay(day)}
                                    className="data-[state=checked]:bg-blue-600"
                                />
                            </div>

                            {enabled ? (
                                <div className="mt-4 flex items-center gap-2">
                                    <Select value={startTime} onValueChange={(value) => handleTimeChange(day, "startTime", value)}>
                                        <SelectTrigger className="w-[140px]">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {timeOptions.map((time) => (
                                                <SelectItem key={`${day}-start-${time}`} value={time}>
                                                    {time}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>

                                    <span className="text-gray-500">to</span>

                                    <Select value={endTime} onValueChange={(value) => handleTimeChange(day, "endTime", value)}>
                                        <SelectTrigger className="w-[140px]">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {timeOptions.map((time) => (
                                                <SelectItem key={`${day}-end-${time}`} value={time}>
                                                    {time}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            ) : (
                                <p className="mt-4 text-gray-500">Not working on this day</p>
                            )}
                        </div>
                    ))}
                </div>

                <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                        Cancel
                    </Button>
                    <Button type="button" className="bg-blue-600 hover:bg-blue-700" onClick={handleSave}>
                        Save
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
