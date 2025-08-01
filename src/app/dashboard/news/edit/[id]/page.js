"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Save, ArrowLeft, Plus, X, Upload } from "lucide-react";
import useAuthDataStore from "@/store/authStore";
import API from "@/api";
import { toast } from "sonner";

export default function EditNews() {
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    news_channel_name: "",
    publish_date: "",
    image: "",
  });
  const [imagePreview, setImagePreview] = useState(null);
  const authData = useAuthDataStore((state) => state.authData);

  useEffect(() => {
    if (params.id) {
      fetchNewsDetails();
    }
  }, [params.id]);

  const fetchNewsDetails = async () => {
    try {
      console.log("Fetching news details for ID:", params.id);
      const response = await API.news.getNewsDetails({
        _id: params.id,
      });

      console.log("News details response:", response);
      console.log("Response type:", typeof response);
      console.log(
        "Response keys:",
        response ? Object.keys(response) : "No response"
      );

      if (response?.success && response.data) {
        const news = response.data;
        console.log("News data:", news);
        setFormData({
          title: news.title || "",
          description: news.description || "",
          news_channel_name: news.news_channel_name || "",
          publish_date: news.publish_date
            ? new Date(news.publish_date).toISOString().split("T")[0]
            : "",
          image: news.image || "",
        });

        // Set image preview if image exists
        if (news.image) {
          setImagePreview(news.image);
        }
      } else if (response && (response._id || response.title)) {
        // Handle case where response is the news object directly
        const news = response;
        console.log("News data (direct response):", news);
        setFormData({
          title: news.title || "",
          description: news.description || "",
          news_channel_name: news.news_channel_name || "",
          publish_date: news.publish_date
            ? new Date(news.publish_date).toISOString().split("T")[0]
            : "",
          image: news.image || "",
        });

        // Set image preview if image exists
        if (news.image) {
          setImagePreview(news.image);
        }
      } else {
        console.error("Failed to load news details - Response:", response);
        toast.error("Failed to load news details");
        router.push("/dashboard/news/all-news");
      }
    } catch (error) {
      console.error("Error fetching news details:", error);
      toast.error("An error occurred while loading news details");
      router.push("/dashboard/news/all-news");
    } finally {
      setInitialLoading(false);
    }
  };

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

    // Convert file to base64 data URL
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
      // Prepare data object (not FormData) - like create news
      const newsData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        news_channel_name: formData.news_channel_name.trim(),
        publish_date: formData.publish_date,
        image: formData.image, // This is now a base64 string
      };

      // Debug: Log the data being sent
      console.log("News update data being sent:", {
        title: newsData.title,
        description: newsData.description,
        news_channel_name: newsData.news_channel_name,
        publish_date: newsData.publish_date,
        image: newsData.image ? "Base64 image data present" : "No image",
      });

      console.log("Updating news with ID:", params.id);

      const response = await API.news.updateNews(newsData, params.id);

      console.log("Update response:", response);
      console.log("Response type:", typeof response);
      console.log(
        "Response keys:",
        response ? Object.keys(response) : "No response"
      );

      if (
        response?.success === true ||
        response?.message?.toLowerCase().includes("success") ||
        response?.status === "success" ||
        response?.message?.toLowerCase().includes("updated") ||
        response?.message?.toLowerCase().includes("modified") ||
        response?.message?.toLowerCase().includes("news") ||
        response?._id || // If response has _id, it's likely successful
        response?.title || // If response has title, it's likely successful
        (typeof response === "object" &&
          Object.keys(response).length > 0 &&
          !response.error)
      ) {
        toast.success("News updated successfully");
        router.push("/dashboard/news/all-news");
      } else {
        console.error("Failed to update news - Response:", response);
        toast.error(response?.message || "Failed to update news");
      }
    } catch (error) {
      console.error("Error updating news:", error);
      toast.error("An error occurred while updating the news");
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col">
      {/* Header Section */}
      <div className="w-full flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Link
            href="/dashboard/news/all-news"
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
          <p className="text-[#4B4B4B] font-medium">Edit News</p>
        </div>
      </div>

      {/* Form Section */}
      <div className="flex-1 overflow-y-auto">
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-gray-900">
              Edit News Article
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
                  {/* Image Upload Input */}
                  <div className="flex items-center gap-4">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="image-upload"
                    />
                    <label
                      htmlFor="image-upload"
                      className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50 transition-colors"
                    >
                      <Upload className="w-4 h-4" />
                      Choose Image
                    </label>
                    {imagePreview && (
                      <Button
                        type="button"
                        onClick={removeImage}
                        variant="outline"
                        size="sm"
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="w-4 h-4 mr-1" />
                        Remove
                      </Button>
                    )}
                  </div>

                  {/* Image Preview */}
                  {imagePreview && (
                    <div className="space-y-2">
                      <Label className="text-sm text-gray-600">
                        Image Preview:
                      </Label>
                      <div className="relative w-48 h-32 border border-gray-200 rounded-md overflow-hidden">
                        <Image
                          src={imagePreview}
                          alt="News preview"
                          fill
                          className="object-cover"
                          unoptimized={imagePreview.startsWith("data:")}
                        />
                      </div>
                    </div>
                  )}

                  {/* Help Text */}
                  <p className="text-xs text-gray-500">
                    Supported formats: JPEG, PNG, GIF, WebP (Max size: 2MB)
                  </p>
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
                      Updating...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Update News
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
