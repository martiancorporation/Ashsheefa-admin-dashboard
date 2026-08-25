import React, { useState, useEffect } from "react"
import { Loader2, IndianRupee, CreditCard, CheckCircle2, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner"
import appointments from "@/api/appointments"
import { dedupeDoctorTitle } from "@/lib/formatText"

const PAYMENT_MODES = [
    { value: "cash", label: "Cash" },
    { value: "upi", label: "UPI" },
    { value: "card", label: "Card" },
]

const MODE_LABEL = {
    cash: "Cash",
    upi: "UPI",
    card: "Card",
}

export function UpdateStatusModal({ open, onOpenChange, appointment, onSave }) {
    const [loading, setLoading] = useState(false)
    const [amount, setAmount] = useState("")
    const [paymentMode, setPaymentMode] = useState("")
    const [paid, setPaid] = useState(false)
    const [transactionId, setTransactionId] = useState("")
    const [confirmedAmount, setConfirmedAmount] = useState("")
    const [confirmedMode, setConfirmedMode] = useState("")
    const [confirmedTxnId, setConfirmedTxnId] = useState("")

    // Cash has no reference number; UPI/card do.
    const needsTransactionId = paymentMode === "upi" || paymentMode === "card"

    // Reset state whenever modal opens fresh
    useEffect(() => {
        if (open && appointment) {
            if (appointment.paymentStatus === "paid") {
                // Already paid — jump straight to locked view
                setConfirmedAmount(appointment.amount ?? "")
                setConfirmedMode(appointment.paymentMode ?? "")
                setConfirmedTxnId(appointment.transaction_id ?? "")
                setPaid(true)
            } else {
                setAmount(appointment.amount ?? appointment.doctorId?.fees ?? "")
                setPaymentMode("")
                setTransactionId("")
                setPaid(false)
                setConfirmedAmount("")
                setConfirmedMode("")
                setConfirmedTxnId("")
            }
        }
    }, [open, appointment])

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!paymentMode) {
            toast.error("Please select a payment mode")
            return
        }
        if (amount === "" || isNaN(Number(amount))) {
            toast.error("Please enter a valid amount")
            return
        }

        setLoading(true)
        try {
            const res = await appointments.updateAppointment(appointment._id, {
                status: "Confirmed", 
                paymentStatus: "paid",
                amount: Number(amount),
                paymentMode,
                // Cash carries no reference, so send an empty value for it.
                transaction_id: needsTransactionId ? transactionId.trim() : "",
            })

            if (res?.success || res?.data) {
                toast.success("Appointment marked as paid")
                // Lock the modal into confirmation view
                setConfirmedAmount(amount)
                setConfirmedMode(paymentMode)
                setConfirmedTxnId(needsTransactionId ? transactionId.trim() : "")
                setPaid(true)
                onSave?.()
            } else {
                toast.error("Failed to update payment status")
            }
        } catch (error) {
            console.error("Error marking as paid:", error)
            toast.error("An error occurred while updating the payment status")
        } finally {
            setLoading(false)
        }
    }

    const patientName =
        appointment?.patientId?.patient_full_name ||
        appointment?.patient_full_name ||
        "—"
    const doctorName = dedupeDoctorTitle(appointment?.doctorId?.fullName) || "—"

    return (
        <Dialog open={open} onOpenChange={(val) => {
            // Allow closing even in paid state
            if (!loading) onOpenChange(val)
        }}>
            <DialogContent className="sm:max-w-md">
                {/* ── LOCKED / CONFIRMED VIEW ── */}
                {paid ? (
                    <>
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2 text-base text-green-700">
                                <CheckCircle2 className="w-5 h-5 text-green-600" />
                                Payment Details
                            </DialogTitle>
                            <DialogDescription className="text-xs text-slate-500">
                                Last updated:{" "}
                                {appointment?.updatedAt
                                    ? new Date(appointment.updatedAt).toLocaleString("en-IN", {
                                        day: "numeric",
                                        month: "short",
                                        year: "numeric",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    })
                                    : "—"}
                            </DialogDescription>
                        </DialogHeader>

                        {/* Receipt-style locked card */}
                        <div className="rounded-xl border border-green-200 bg-green-50 p-5 space-y-4 mt-1">

                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-500">Patient</span>
                                    <span className="text-sm font-medium text-gray-800">{patientName}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-500">Doctor</span>
                                    <span className="text-sm font-medium text-gray-800">{doctorName}</span>
                                </div>

                                <div className="border-t border-green-200 pt-3 space-y-3">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-500">Status</span>
                                        <span className="inline-flex items-center gap-1 text-sm font-semibold text-green-700 bg-green-100 px-2.5 py-0.5 rounded-full">
                                            <CheckCircle2 className="w-3.5 h-3.5" />
                                            Paid
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-500">Amount</span>
                                        <span className="text-base font-bold text-gray-900">
                                            ₹{Number(confirmedAmount).toLocaleString("en-IN")}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-500">Transaction Id</span>
                                        <span className="text-sm font-semibold text-gray-800">
                                            {confirmedTxnId || appointment?.transaction_id || appointment?.orderId || "—"}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-500">Payment Mode</span>
                                        <span className="text-sm font-semibold text-gray-800 uppercase tracking-wide">
                                            {MODE_LABEL[confirmedMode] || confirmedMode}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* <DialogFooter className="mt-2">
                            <Button
                                type="button"
                                className="w-full bg-green-600 hover:bg-green-700 text-white"
                                onClick={() => onOpenChange(false)}
                            >
                                Done
                            </Button>
                        </DialogFooter> */}
                    </>
                ) : (
                    /* ── INPUT / FORM VIEW ── */
                    <>
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2 text-base text-[#4B4B4B]">
                                <CreditCard className="w-4 h-4 text-green-600" />
                                Mark as Paid
                            </DialogTitle>
                            <DialogDescription className="text-xs text-slate-500">
                                Confirm the payment details below to mark this appointment as paid.
                            </DialogDescription>
                        </DialogHeader>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            {/* Summary card */}
                            {appointment && (
                                <div className="bg-gray-50 border border-gray-100 p-3 rounded-lg text-sm text-gray-600 space-y-1">
                                    <p>
                                        <span className="font-medium text-gray-800">Patient: </span>
                                        {patientName}
                                    </p>
                                    <p>
                                        <span className="font-medium text-gray-800">Doctor: </span>
                                        {doctorName}
                                    </p>
                                </div>
                            )}

                            {/* Amount + Payment Mode side by side */}
                            <div className="flex gap-3 items-center">
                                {/* Amount */}
                                <div className="flex-1 space-y-1.5">
                                    <Label className="text-[#4A4A4B] text-sm">
                                        Amount (₹) <span className="text-red-500">*</span>
                                    </Label>
                                    <div className="relative cursor-not-allowed">
                                        <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                                        <Input
                                            type="number"
                                            value={amount}
                                            disabled
                                            readOnly
                                            className="pl-8 bg-slate-100 border-[#DDDDDD] shadow-none text-slate-700 cursor-not-allowed"
                                            placeholder="0"
                                        />
                                    </div>
                                </div>

                                {/* Payment Mode */}
                                <div className="flex-1 space-y-1.5">
                                    <Label className="text-[#4A4A4B] text-sm">
                                        Payment Mode <span className="text-red-500">*</span>
                                    </Label>
                                    <Select
                                        value={paymentMode}
                                        onValueChange={(v) => {
                                            setPaymentMode(v)
                                            if (v === "cash") setTransactionId("")
                                        }}
                                    >
                                        <SelectTrigger className="bg-[#FBFBFB] border-[#DDDDDD] shadow-none">
                                            <SelectValue placeholder="Select mode" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {PAYMENT_MODES.map((mode) => (
                                                <SelectItem key={mode.value} value={mode.value}>
                                                    {mode.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            {/* Transaction reference — only for UPI / card (cash has none) */}
                            {needsTransactionId && (
                                <div className="space-y-1.5">
                                    <Label className="text-[#4A4A4B] text-sm">
                                        {MODE_LABEL[paymentMode]} Transaction ID{" "}
                                        <span className="text-gray-400 font-normal">(optional)</span>
                                    </Label>
                                    <Input
                                        type="text"
                                        value={transactionId}
                                        onChange={(e) => setTransactionId(e.target.value)}
                                        className="bg-[#FBFBFB] border-[#DDDDDD] shadow-none"
                                        placeholder={
                                            paymentMode === "upi"
                                                ? "Enter UPI reference / UTR number"
                                                : "Enter card transaction / approval code"
                                        }
                                    />
                                </div>
                            )}

                            <DialogFooter>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => onOpenChange(false)}
                                    disabled={loading}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    className="bg-green-600 hover:bg-green-700 text-white"
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            Processing...
                                        </>
                                    ) : (
                                        "Confirm Payment"
                                    )}
                                </Button>
                            </DialogFooter>
                        </form>
                    </>
                )}
            </DialogContent>
        </Dialog>
    )
}