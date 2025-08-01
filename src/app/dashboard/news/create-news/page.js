"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Save, ArrowLeft, Upload, X, Eye } from "lucide-react";
import useAuthDataStore from "@/store/authStore";
import API from "@/api";
import { toast } from "sonner";

export default function CreateNews() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    news_channel_name: "",
    publish_date: "",
    image: "",
  });
  const [imagePreview, setImagePreview] = useState(null);
  const authData = useAuthDataStore((state) => state.authData);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    // Validate file type
    const validTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
    ];

    if (!validTypes.includes(file.type)) {
      toast.error("Please upload only image files (JPEG, PNG, GIF, WebP)");
      return;
    }

    // Validate file size (max 2MB)
    const maxSize = 2 * 1024 * 1024; // 2MB

    if (file.size > maxSize) {
      toast.error("Image file must be smaller than 2MB");
      return;
    }

    // Convert file to base64 data URL (like doctor upload)
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        console.log("Image converted to base64 successfully");
        setFormData((prev) => ({
          ...prev,
          image: event.target.result,
        }));
        setImagePreview(event.target.result);
      }
    };
    reader.onerror = () => {
      console.error("Error reading file");
      toast.error("Error reading file. Please try again.");
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setFormData((prev) => ({
      ...prev,
      image: "",
    }));
    setImagePreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.title.trim()) {
      toast.error("Title is required");
      return;
    }
    if (!formData.description.trim()) {
      toast.error("Description is required");
      return;
    }
    if (!formData.news_channel_name.trim()) {
      toast.error("News channel name is required");
      return;
    }
    if (!formData.publish_date) {
      toast.error("Publish date is required");
      return;
    }

    setLoading(true);
    try {
      // Prepare data object (not FormData) - like doctor upload
      const newsData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        news_channel_name: formData.news_channel_name.trim(),
        publish_date: formData.publish_date,
        image: formData.image, // This is now a base64 string
      };

      // Debug: Log the data being sent
      console.log("News data being sent:", {
        title: newsData.title,
        description: newsData.description,
        news_channel_name: newsData.news_channel_name,
        publish_date: newsData.publish_date,
        image: newsData.image ? "Base64 image data present" : "No image",
      });

      console.log("About to send request...");

      const response = await API.news.addNews(newsData);

      console.log("Response received:", response);
      console.log("Response type:", typeof response);
      console.log("Response success:", response?.success);
      console.log("Response data:", response?.data);

      if (response && (response.success || response._id)) {
        toast.success("News created successfully");
        router.push("/dashboard/news/all-news");
      } else if (response && response.data && response.data.success) {
        toast.success("News created successfully");
        router.push("/dashboard/news/all-news");
      } else {
        console.error("API returned error:", response);
        const errorMessage =
          response?.message ||
          response?.data?.message ||
          "Failed to create news";
        toast.error(errorMessage);
      }
    } catch (error) {
      console.error("Error creating news:", error);
      toast.error("An error occurred while creating the news");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-full flex flex-col">
      {/* Header Section */}
      <div className="w-full flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Link
            href="/dashboard/news"
            className="p-2 hover:bg-gray-50 rounded-md transition-colors duration-200 cursor-pointer"
          >
            <Image
              width={100}
              height={100}
              src={"/assets/images/dashboard/leftArrow.svg"}
              alt="leftArrow"
              className="w-4 h-4 hover:scale-110 transition-transform duration-200"
            />
          </Link>
          <div className="w-[1.5px] h-[15px] bg-[#7F7F7F]"></div>
          <p className="text-[#4B4B4B] font-medium">Create News</p>
        </div>
      </div>

      {/* Form Section */}
      <div className="w-full flex-1 overflow-y-auto">
        <Card className="w-full mx-auto">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-gray-900">
              Add New News Article
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title" className="text-sm font-medium">
                  Title *
                </Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Enter news title"
                  className="w-full"
                  required
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description" className="text-sm font-medium">
                  Description *
                </Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Enter news description"
                  className="w-full min-h-[120px]"
                  required
                />
              </div>

              {/* News Channel Name */}
              <div className="space-y-2">
                <Label
                  htmlFor="news_channel_name"
                  className="text-sm font-medium"
                >
                  News Channel Name *
                </Label>
                <Input
                  id="news_channel_name"
                  name="news_channel_name"
                  value={formData.news_channel_name}
                  onChange={handleInputChange}
                  placeholder="Enter news channel name"
                  className="w-full"
                  required
                />
              </div>

              {/* Publish Date */}
              <div className="space-y-2">
                <Label htmlFor="publish_date" className="text-sm font-medium">
                  Publish Date *
                </Label>
                <Input
                  id="publish_date"
                  name="publish_date"
                  type="date"
                  value={formData.publish_date}
                  onChange={handleInputChange}
                  className="w-full"
                  required
                />
              </div>

              {/* Image Upload */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">News Image</Label>
                <div className="space-y-3">
                  {/* File upload input */}
                  <div className="flex gap-2">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="flex-1"
                      id="image-upload"
                    />
                    <Label
                      htmlFor="image-upload"
                      className="flex items-center gap-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 cursor-pointer transition-colors"
                    >
                      <Upload className="w-4 h-4" />
                      Upload
                    </Label>
                  </div>

                  {/* Image Preview */}
                  {imagePreview && (
                    <div className="space-y-2">
                      <Label className="text-sm text-gray-600">
                        Image Preview:
                      </Label>
                      <div className="relative group border border-gray-200 rounded-lg overflow-hidden max-w-md">
                        <Image
                          src={imagePreview}
                          alt="News preview"
                          width={500}
                          height={500}
                          className="w-full h-48 object-cover"
                          unoptimized={imagePreview.startsWith("data:")}
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center">
                          <Button
                            type="button"
                            onClick={removeImage}
                            variant="ghost"
                            size="sm"
                            className="opacity-0 group-hover:opacity-100 text-white hover:text-red-300 transition-opacity duration-200"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                        <div className="p-2 bg-gray-50">
                          <p className="text-xs text-gray-600">
                            Image uploaded successfully
                          </p>
                          <p className="text-xs text-gray-500">
                            Base64 encoded image
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Upload guidelines */}
                  <div className="text-xs text-gray-500 space-y-1">
                    <p>• Supported formats: JPEG, PNG, GIF, WebP</p>
                    <p>• Maximum file size: 2MB</p>
                    <p>• Only one image per news article</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-4 pt-6">
                <Link href="/dashboard/news/all-news">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Cancel
                  </Button>
                </Link>
                <Button
                  type="submit"
                  disabled={loading}
                  className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Create News
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
