import { useEffect, useState } from "react";
import { CheckCircle2, CreditCard, IndianRupee, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import API from "@/api";
import { MODE_LABEL, PAYMENT_MODES, modeHasReference } from "./constants";

export function MarkPaidModal({ open, onOpenChange, booking, onSave }) {
  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState("");
  const [paymentMode, setPaymentMode] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [paid, setPaid] = useState(false);
  const [confirmed, setConfirmed] = useState({ amount: "", mode: "", txnId: "" });

  const needsTransactionId = paymentMode === "upi" || paymentMode === "card";
  
  const receiptMode = confirmed.mode || booking?.paymentMode;
  const receiptNeedsTxnId = modeHasReference(receiptMode);

  useEffect(() => {
    if (!open || !booking) return;
    if (booking.paymentStatus === "paid") {
      setConfirmed({
        amount: booking.amount ?? "",
        mode: booking.paymentMode ?? "",
        txnId: booking.transaction_id ?? booking.orderId ?? "",
      });
      setPaid(true);
    } else {
      setAmount(booking.amount ?? "");
      setPaymentMode("");
      setTransactionId("");
      setPaid(false);
      setConfirmed({ amount: "", mode: "", txnId: "" });
    }
  }, [open, booking]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!paymentMode) {
      toast.error("Please select a payment mode");
      return;
    }
    if (amount === "" || isNaN(Number(amount))) {
      toast.error("Please enter a valid amount");
      return;
    }

    setLoading(true);
    try {
      const res = await API.testBookings.updateBooking(booking._id, {
        paymentStatus: "paid",
        paymentMode,
        amount: Number(amount),
        transaction_id: needsTransactionId ? transactionId.trim() : "",
      });

      if (res?.success || res?.data) {
        toast.success("Booking marked as paid");
        onSave?.();
        onOpenChange(false);
      } else {
        toast.error(res?.error || res?.message || "Failed to update payment status");
      }
    } catch (error) {
      console.error("Error marking booking as paid:", error);
      toast.error("An error occurred while updating the payment status");
    } finally {
      setLoading(false);
    }
  };

  const patientName = booking?.patientId?.patient_full_name || "—";

  return (
    <Dialog open={open} onOpenChange={(v) => !loading && onOpenChange(v)}>
      <DialogContent className="sm:max-w-md">
        {paid ? (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-base text-green-700">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
                Payment Details
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-500">
                Last updated:{" "}
                {booking?.updatedAt
                  ? new Date(booking.updatedAt).toLocaleString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : "—"}
              </DialogDescription>
            </DialogHeader>

            <div className="rounded-xl border border-green-200 bg-green-50 p-5 space-y-3 mt-1">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Patient</span>
                <span className="text-sm font-medium text-gray-800">{patientName}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Tests</span>
                <span className="text-sm font-medium text-gray-800">
                  {booking?.tests_count ?? booking?.tests?.length ?? "—"}
                </span>
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
                  <span className="text-sm text-gray-500">Tests Total</span>
                  <span className="text-sm text-gray-800">
                    ₹{Number(booking?.tests_total || 0).toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Registration Fee</span>
                  <span className="text-sm text-gray-800">
                    ₹{Number(booking?.registration_fee || 0).toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Total</span>
                  <span className="text-base font-bold text-gray-900">
                    ₹{Number(confirmed.amount).toLocaleString("en-IN")}
                  </span>
                </div>
                {receiptNeedsTxnId && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Transaction Id</span>
                    <span className="text-sm font-semibold text-gray-800">
                      {confirmed.txnId || booking?.transaction_id || booking?.orderId || "—"}
                    </span>
                  </div>
                )}
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Payment Mode</span>
                  <span className="text-sm font-semibold text-gray-800">
                    {MODE_LABEL[confirmed.mode] || confirmed.mode}
                  </span>
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-base text-[#4B4B4B]">
                <CreditCard className="w-4 h-4 text-green-600" />
                Mark as Paid
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-500">
                Confirm the payment details below to mark these tests as paid.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="bg-gray-50 border border-gray-100 p-3 rounded-lg text-sm text-gray-600 space-y-1">
                <p>
                  <span className="font-medium text-gray-800">Patient: </span>
                  {patientName}
                </p>
                <p>
                  <span className="font-medium text-gray-800">Tests: </span>
                  {booking?.tests_count ?? booking?.tests?.length ?? "—"}
                </p>
                <p className="text-xs text-gray-500">
                  ₹{Number(booking?.tests_total || 0)} tests + ₹
                  {Number(booking?.registration_fee || 0)} registration
                </p>
              </div>

              <div className="flex gap-3 items-center">
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

                <div className="flex-1 space-y-1.5">
                  <Label className="text-[#4A4A4B] text-sm">
                    Payment Mode <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={paymentMode}
                    onValueChange={(v) => {
                      setPaymentMode(v);
                      if (v === "cash") setTransactionId("");
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
  );
}
