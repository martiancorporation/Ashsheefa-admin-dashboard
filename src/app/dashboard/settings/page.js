"use client";

import { useState } from "react";
import { ArrowLeft, Pencil } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PasswordUpdateForm } from "./components/password-update-form";
import { EditDetailsForm } from "./components/edit-details-form";
import { EmailUpdateForm } from "./components/email-update-form";

export default function SettingsPage() {
  const [activeView, setActiveView] = useState("details");

  const userDetails = {
    fullName: "Dr. Farukuddin Purkaite",
    email: "admin001@gmail.com",
    contactNumber: "+91 2355658454",
    role: "Super Admin",
  };

  return (
    <>
      {/* Header */}
      <div className="w-full flex items-center justify-between">
        <div className="flex items-center  space-x-2 ">
          <Image
            width={100}
            height={100}
            src={"/assets/images/dashboard/leftArrow.svg"}
            alt="leftArrow"
            className="w-4 h-4"
          />
          <div className="w-[1.2px] h-[15px] bg-[#7F7F7F]"></div>
          <p className="text-[#4B4B4B] font-medium ">Settings</p>
        </div>
      </div>

      <div className="h-[calc(100%-50px)] overflow-y-scroll overscroll-y-contain eme-scroll grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Profile Card */}
        <div className="md:col-span-1">
          <Card className="overflow-hidden py-0 border-none rounded-none shadow-none ">
            <div className="relative">
              <div className=" ">
                <div className="relative w-full h-[250px]  ">
                  <Image
                    src="/assets/images/settings/director.webp"
                    alt="Profile"
                    width={500}
                    height={500}
                    className="w-full h-full object-cover rounded-[10px]"
                  />
                  <h3 className="absolute w-[95%] bottom-1.5 left-1/2 transform -translate-x-1/2 rounded-md bg-white/40 shadow backdrop-blur-sm text-base font-medium text-[#323232] text-center py-2">
                    Super Admin
                  </h3>
                </div>
              </div>
            </div>

            <div className=" ">
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-[#7F7F7F]">Full Name</p>
                  <p className="font-medium text-[#323232]">
                    {userDetails.fullName}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-[#7F7F7F]">Email Address</p>
                  <p className="font-medium text-[#323232]">
                    {userDetails.email}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-[#7F7F7F]">Contact Number</p>
                  <p className="font-medium text-[#323232]">
                    {userDetails.contactNumber}
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Settings Forms */}
        <div className="md:col-span-2 space-y-4 border-l-[1.5px] pl-4 border-[#DDDDDD]">
          {/* Edit Details */}
          <Card className="py-2 px-4 border border-[#DDDDDD] shadow-none bg-white rounded-[10px]">
            <div className="flex justify-between items-center ">
              <h3 className="text-base text-[#323232] font-medium">
                Edit details
              </h3>
              <Button
                variant="outline"
                size="sm"
                className="text-[#005CD4] border-none shadow-none"
                onClick={() => setActiveView("details")}
              >
                <Pencil className="h-4 w-4 " />
                Edit details
              </Button>
            </div>

            {activeView === "details" && <EditDetailsForm />}
          </Card>

          {/* Password Update */}
          <Card className="py-2 px-4 border border-[#DDDDDD] shadow-none bg-white rounded-[10px]">
            <div className="flex justify-between items-center ">
              <h3 className="text-base text-[#323232] font-medium">
                Password Update
              </h3>
              <Button
                variant="outline"
                size="sm"
                className="text-[#005CD4] border-none shadow-none"
                onClick={() => setActiveView("password")}
              >
                <Pencil className="h-4 w-4 " />
                Edit Password
              </Button>
            </div>

            {activeView === "password" && <PasswordUpdateForm />}
          </Card>

          {/* Email Update */}
          <Card className="py-2 px-4 border border-[#DDDDDD] shadow-none bg-white rounded-[10px]">
            <div className="flex justify-between items-center ">
              <h3 className="text-base text-[#323232] font-medium">
                Email Update
              </h3>
              <Button
                variant="outline"
                size="sm"
                className="text-[#005CD4] border-none shadow-none"
                onClick={() => setActiveView("email")}
              >
                <Pencil className="h-4 w-4 " />
                Edit Email
              </Button>
            </div>

            {activeView === "email" && <EmailUpdateForm />}
          </Card>
        </div>
      </div>
    </>
  );
}
