"use client"

import React from "react"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function ManageAvailabilityModal({ open, onOpenChange, doctor, onSave }) {
    const [schedule, setSchedule] = React.useState({
        monday: { enabled: doctor?.availability?.some(a => a.day === "Monday") || false, startTime: "09:00", endTime: "17:00" },
        tuesday: { enabled: doctor?.availability?.some(a => a.day === "Tuesday") || false, startTime: "09:00", endTime: "17:00" },
        wednesday: { enabled: doctor?.availability?.some(a => a.day === "Wednesday") || false, startTime: "09:00", endTime: "17:00" },
        thursday: { enabled: doctor?.availability?.some(a => a.day === "Thursday") || false, startTime: "09:00", endTime: "17:00" },
        friday: { enabled: doctor?.availability?.some(a => a.day === "Friday") || false, startTime: "09:00", endTime: "17:00" },
        saturday: { enabled: doctor?.availability?.some(a => a.day === "Saturday") || false, startTime: "09:00", endTime: "17:00" },
        sunday: { enabled: doctor?.availability?.some(a => a.day === "Sunday") || false, startTime: "09:00", endTime: "17:00" },
    })

    // Initialize with existing availability data
    React.useEffect(() => {
        if (doctor?.availability) {
            const newSchedule = { ...schedule }
            doctor.availability.forEach(avail => {
                const dayKey = avail.day.toLowerCase()
                if (newSchedule[dayKey]) {
                    newSchedule[dayKey] = {
                        enabled: true,
                        startTime: avail.startTime,
                        endTime: avail.endTime
                    }
                }
            })
            setSchedule(newSchedule)
        }
    }, [doctor])

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
        // Process the schedule data to match the API structure
        const availability = Object.entries(schedule)
            .filter(([_, value]) => value.enabled)
            .map(([day, value]) => ({
                day: day.charAt(0).toUpperCase() + day.slice(1),
                startTime: value.startTime,
                endTime: value.endTime
            }))

        const data = {
            _id: doctor._id,
            availability
        }
        console.log("Updated availability:", data)

        if (onSave) {
            onSave(data)
        }
    }

    const handleCancel = () => {
        onOpenChange(false)
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <div className="flex items-center">
                        <button onClick={handleCancel} className="mr-2">
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
                    <Button type="button" variant="outline" onClick={handleCancel}>
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
