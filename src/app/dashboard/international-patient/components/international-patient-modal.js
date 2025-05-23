"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function InternationalPatientModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "",
    country: "",
    passportNumber: "",
    department: "",
    referralDoctor: "",
    appointmentDate: "",
    status: "Upcoming",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Implement form submission logic
    console.log(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">
            Add New International Patient
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Full Name</label>
              <Input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Enter full name"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Age</label>
              <Input
                type="number"
                value={formData.age}
                onChange={(e) =>
                  setFormData({ ...formData, age: e.target.value })
                }
                placeholder="Enter age"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Gender</label>
              <Select
                value={formData.gender}
                onValueChange={(value) =>
                  setFormData({ ...formData, gender: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Country</label>
              <Input
                type="text"
                value={formData.country}
                onChange={(e) =>
                  setFormData({ ...formData, country: e.target.value })
                }
                placeholder="Enter country"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Passport Number</label>
              <Input
                type="text"
                value={formData.passportNumber}
                onChange={(e) =>
                  setFormData({ ...formData, passportNumber: e.target.value })
                }
                placeholder="Enter passport number"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Department</label>
              <Select
                value={formData.department}
                onValueChange={(value) =>
                  setFormData({ ...formData, department: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Orthopedics">Orthopedics</SelectItem>
                  <SelectItem value="Cardiology">Cardiology</SelectItem>
                  <SelectItem value="Neurology">Neurology</SelectItem>
                  <SelectItem value="Pediatrics">Pediatrics</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Referral Doctor</label>
              <Input
                type="text"
                value={formData.referralDoctor}
                onChange={(e) =>
                  setFormData({ ...formData, referralDoctor: e.target.value })
                }
                placeholder="Enter referral doctor"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Appointment Date</label>
              <Input
                type="date"
                value={formData.appointmentDate}
                onChange={(e) =>
                  setFormData({ ...formData, appointmentDate: e.target.value })
                }
                required
              />
            </div>
          </div>

          <div className="flex justify-end gap-4 mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="px-4 py-2"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 px-4 py-2"
            >
              Add Patient
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
