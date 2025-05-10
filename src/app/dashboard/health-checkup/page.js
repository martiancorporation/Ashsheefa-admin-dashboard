"use client";

import { useState } from "react";
import { ArrowLeft, Plus, Search } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import AllHealthPackage from "./components/all-health-package";
import { AddHealthCheckupModal } from "./components/add-health-checkup-modal";

export default function HealthCheckupPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedGender, setSelectedGender] = useState("");

  const categories = [
    { name: "All Categories" },
    { name: "General Health" },
    { name: "Heart" },
    { name: "Women" },
    { name: "Senior Citizen" },
    { name: "Special" },
    { name: "Recommended" },
  ];

  return (
    <>
        <div className="w-full flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Link href="/dashboard" className="flex items-center text-gray-600">
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div className="w-[1.5px] h-[15px] bg-[#7F7F7F]"></div>
            <p className="text-[#4B4B4B] font-medium">Health checkup</p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div className="w-full md:w-auto flex flex-wrap items-center gap-2">
            <Select value={selectedGender} onValueChange={setSelectedGender}>
              <SelectTrigger className="w-full md:w-[120px]">
                <SelectValue placeholder="Gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="all">All</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
            >
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category, index) => (
                  <SelectItem
                    key={index}
                    value={category.name.toLowerCase().replace(" ", "-")}
                  >
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-3 w-full md:w-auto">
            <div className="relative w-full md:w-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search packages..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 rounded-md border border-gray-300 w-full md:w-[300px]"
              />
            </div>

            <AddHealthCheckupModal>
              <Button className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2 whitespace-nowrap">
                <Plus className="h-4 w-4" />
                Add Health checkup
              </Button>
            </AddHealthCheckupModal>
          </div>
        </div>

        <div className="w-full h-[calc(100%-50px)] overflow-y-scroll overscroll-y-contain eme-scroll">
          <AllHealthPackage
            searchQuery={searchQuery}
            selectedCategory={selectedCategory}
            selectedGender={selectedGender}
          />
        </div>
    </>
  );
}
