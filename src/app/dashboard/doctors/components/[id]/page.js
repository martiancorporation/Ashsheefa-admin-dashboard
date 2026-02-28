"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { ArrowLeft, Mail, Phone, Calendar, Globe } from "lucide-react";

export default function DoctorDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/doctors/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        const data = await res.json();
        setDoctor(data.data); // adjust if needed
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchDoctor();
  }, [id]);

  if (loading) return <div className="p-6">Loading...</div>;
  if (!doctor) return <div className="p-6">Doctor not found</div>;

  return (
    <div className="p-6 space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1 hover:text-black"
        >
          <ArrowLeft size={16} /> Doctors
        </button>
        <span>/</span>
        <span className="text-black font-medium">Details</span>
      </div>

      {/* Top Card */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <div className="flex justify-between items-start flex-wrap gap-4">
          {/* Left Side */}
          <div className="flex gap-4">
            <div className="w-20 h-20 rounded-full overflow-hidden border">
              {doctor.profilePic ? (
                <Image
                  src={doctor.profilePic}
                  alt={doctor.fullName}
                  width={80}
                  height={80}
                  className="object-cover w-full h-full"
                />
              ) : (
                <div className="w-full h-full bg-gray-200" />
              )}
            </div>

            <div>
              <h2 className="text-xl font-bold">
                {doctor.fullName}
              </h2>
              <p className="text-gray-500">{doctor.qualification}</p>

              <div className="flex gap-6 mt-3 text-sm text-gray-600 flex-wrap">
                <div>
                  <span className="font-medium">Experience:</span>{" "}
                  {doctor.experience} Years
                </div>
                <div>
                  <span className="font-medium">Department:</span>{" "}
                  {doctor.department}
                </div>
                <div>
                  <span className="font-medium">Language:</span>{" "}
                  {doctor.languages?.join(", ")}
                </div>
              </div>

              <div className="flex gap-6 mt-3 text-sm text-gray-600 flex-wrap">
                <div className="flex items-center gap-2">
                  <Phone size={14} />
                  {doctor.contactNumber}
                </div>
                <div className="flex items-center gap-2">
                  <Mail size={14} />
                  {doctor.email}
                </div>
              </div>
            </div>
          </div>

          {/* Right Buttons */}
          <div className="flex gap-3">
            <button
              onClick={() =>
                router.push(`/dashboard/doctors/edit/${doctor._id}`)
              }
              className="px-4 py-2 border rounded-md text-blue-600 border-blue-600 hover:bg-blue-50"
            >
              Edit Doctor
            </button>

            <button className="px-4 py-2 border rounded-md text-red-600 border-red-600 hover:bg-red-50">
              Delete Doctor
            </button>
          </div>
        </div>
      </div>

      {/* About Section */}
      {doctor.bio && (
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h3 className="font-semibold mb-2">About Doctor</h3>
          <p className="text-gray-600 text-sm leading-relaxed">
            {doctor.bio}
          </p>
        </div>
      )}

      {/* Areas of Expertise */}
      {doctor.specialization && (
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h3 className="font-semibold mb-3">Areas Of Expertise</h3>
          <ul className="list-disc pl-6 text-sm text-gray-600 space-y-2">
            {doctor.specialization.split(",").map((item, index) => (
              <li key={index}>{item.trim()}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}