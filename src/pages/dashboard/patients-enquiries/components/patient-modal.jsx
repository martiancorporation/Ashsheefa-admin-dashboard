import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import API from "@/api";
import { toast } from "sonner";
import { z } from "zod";

const enquirySchema = z.object({
  name: z
    .string()
    .transform((v) => v.replace(/[^a-zA-Z\s]/g, "").replace(/\s+/g, " ").trim())
    .refine((v) => /^[A-Za-z]+(?: [A-Za-z]+)*$/.test(v), {
      message: "Please enter a valid full name",
    }),
  phone_number: z
    .string()
    .transform((v) => v.replace(/\D/g, "").slice(0, 10))
    .refine((v) => /^\d{10}$/.test(v), {
      message: "Please enter a valid 10-digit phone number",
    }),
});

export function PatientModal({
  isOpen,
  onClose,
  isEdit = false,
  patientData,
  onSuccess,
}) {
  const [formData, setFormData] = useState({
    name: patientData?.name || "",
    phone_number: (patientData?.phone_number || "")
      .replace(/\D/g, "")
      .slice(-10),
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const handleNameChange = (e) => {
    const value = e.target.value
      .replace(/[^a-zA-Z\s]/g, "")
      .replace(/\s+/g, " ")
      .trimStart();
    setFormData((prev) => ({ ...prev, name: value }));
    if (errors.name) setErrors((prev) => ({ ...prev, name: "" }));
  };

  const handlePhoneChange = (e) => {
    const digits = e.target.value.replace(/\D/g, "").slice(0, 10);
    setFormData((prev) => ({ ...prev, phone_number: digits }));
    if (errors.phone_number)
      setErrors((prev) => ({ ...prev, phone_number: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate with zod
    const parsed = enquirySchema.safeParse(formData);
    if (!parsed.success) {
      const fieldErrors = {};
      parsed.error.issues.forEach((i) => {
        if (!fieldErrors[i.path[0]]) fieldErrors[i.path[0]] = i.message;
      });
      setErrors(fieldErrors);
      toast.error(parsed.error.issues[0].message);
      return;
    }
    setErrors({});

    setIsSubmitting(true);

    try {
      const formattedData = {
        ...formData,
        phone_number: `+91${formData.phone_number}`,
      };

      const response =
        await API.patientsEnquiry.addPatientsEnquiry(formattedData);

      if (response && !response.error) {
        toast.success("Patient enquiry added successfully");
        onClose();
        if (onSuccess) {
          onSuccess();
        }
      } else {
        toast.error("Failed to add patient enquiry");
      }
    } catch (error) {
      console.error("Error adding patient enquiry:", error);
      toast.error("Error adding patient enquiry");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-lg py-4  max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex gap-2 items-center text-[#4B4B4B]">
            <img
              src={"/assets/images/dashboard/leftArrow.svg"}
              alt="leftArrow"
              className="w-4 h-4"
            />
            <div className="w-[1.5px] h-[15px] bg-[#7F7F7F]"></div>
            <DialogTitle className={`text-[#4B4B4B] text-sm`}>
              {isEdit ? "Edit Patient Enquiry" : "Add New Patient Enquiry"}
            </DialogTitle>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name*</Label>
            <Input
              id="name"
              name="name"
              placeholder="Enter full name"
              value={formData.name}
              onChange={handleNameChange}
              required
              className={`bg-[#FBFBFB] border rounded-[6px] ${
                errors.name
                  ? "border-red-500 focus-visible:ring-red-400"
                  : "border-[#DDDDDD]"
              }`}
            />
            {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone_number">Phone Number*</Label>
            <Input
              id="phone_number"
              name="phone_number"
              type="tel"
              inputMode="numeric"
              placeholder="Enter phone number"
              value={formData.phone_number}
              onChange={handlePhoneChange}
              required
              maxLength={10}
              className={`bg-[#FBFBFB] border rounded-[6px] ${
                errors.phone_number
                  ? "border-red-500 focus-visible:ring-red-400"
                  : "border-[#DDDDDD]"
              }`}
            />
            {errors.phone_number && (
              <p className="text-xs text-red-500">{errors.phone_number}</p>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
              className="cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-600 hover:bg-blue-700 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isEdit ? "Updating..." : "Adding..."}
                </>
              ) : isEdit ? (
                "Update Enquiry"
              ) : (
                "Add Enquiry"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
