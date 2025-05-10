"use client";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AddHealthCheckupModal } from "../components/add-health-checkup-modal";

export default function HealthCheckupDetailsPage({
    params }) {
  // In a real application, you would fetch the health package data based on the ID
  const healthPackage = {
    id: Number.parseInt(params.id),
    name: "Basic Health Package-Male",
    category: "General Health",
    gender: "male",
    tests: 21,
    originalPrice: "₹5700",
    discountPrice: "₹5700",
    image: "/assets/images/healthCheckup/general.png",
    testDetails: [
      "BLOOD UREA NITROGEN, SERUM (1079H-SRL)",
      "GLUCOSE, FASTING, PLASMA / URINE (1302H-SRL)",
      "WHOLE ABDOMEN ULTRASOUND",
      "CREATININE EGFR- EPI (1320HGFREP - SRL)",
      "URINALYSIS (5200U-SRL)",
      "COMPLETE BLOOD COUNT",
      "LIPID PROFILE",
      "LIVER FUNCTION TEST",
      "KIDNEY FUNCTION TEST",
      "THYROID PROFILE",
      "URINE ROUTINE",
      "CHEST X-RAY",
      "ECG",
      "VITAMIN B12",
      "VITAMIN D",
      "HBA1C",
      "CALCIUM",
      "URIC ACID",
      "ELECTROLYTES",
      "IRON STUDIES",
      "PSA (FOR MEN)",
    ],
  };

  const handleDeletePackage = () => {
    console.log("Delete package with ID:", params.id);
    // Here you would delete the package from your state or database
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b py-4 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center mr-2">
                <span className="text-white font-bold">A</span>
              </div>
              <div>
                <h1 className="font-bold text-green-600 uppercase">
                  Ashsheefa
                </h1>
                <p className="text-xs text-blue-500 uppercase">Hospital</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center mb-6">
          <Link
            href="/health-checkup"
            className="flex items-center text-gray-600 mr-2"
          >
            <ArrowLeft className="h-5 w-5 mr-1" />
          </Link>
          <span className="text-gray-600">Health checkup</span>
          <span className="mx-2">›</span>
          <span className="font-medium">Details</span>
        </div>

        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="relative h-64 w-full">
            <Image
              src={healthPackage.image || "/placeholder.svg"}
              alt={healthPackage.name}
              fill
              className="object-cover"
            />
          </div>

          <div className="p-6">
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-6">
              <div>
                <div className="inline-block bg-[#E3F8BC] text-[#323232] text-xs px-2 py-1 rounded-[3px] mb-2">
                  {healthPackage.category}
                </div>
                <h1 className="text-2xl font-bold">{healthPackage.name}</h1>
                <p className="text-gray-500">
                  {healthPackage.tests} tests included
                </p>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="border-red-500 text-red-500 hover:bg-red-50 hover:text-red-600"
                  onClick={handleDeletePackage}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Package
                </Button>

                <AddHealthCheckupModal healthPackage={healthPackage}>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Pencil className="h-4 w-4 mr-2" />
                    Edit Package
                  </Button>
                </AddHealthCheckupModal>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-500 text-sm mb-1">Original Price</p>
                <p className="text-2xl font-bold">
                  {healthPackage.originalPrice}
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-500 text-sm mb-1">Discount Price</p>
                <p className="text-2xl font-bold">
                  {healthPackage.discountPrice}
                </p>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-4">Tests Included</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
                {healthPackage.testDetails.map((test, index) => (
                  <div
                    key={index}
                    className="flex items-start py-2 border-b border-gray-100"
                  >
                    <span className="text-blue-600 mr-2">•</span>
                    <span>{test}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
