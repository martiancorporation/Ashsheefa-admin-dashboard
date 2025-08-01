"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ImagePlus, Eye, Loader2 } from "lucide-react";

import API from "@/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RichTextEditor } from "./rich-text-editor";
import { BlogPreviewModal } from "./preview-modal";
import { toast } from "sonner";
import { useParams, useRouter } from "next/navigation";

const EditBlogPost = () => {
  const router = useRouter();
  const params = useParams();
  const _id = params._id;
  const [imagePreview, setImagePreview] = useState(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    url: "",
    meta_title: "",
    meta_description: "",
    meta_keywords: "",
    short_description: "",
    main_content: "",
    image_file: null,
  });
  const [postData, setPostData] = useState({});

  const getPostDetails = async () => {
    try {
      const response = await API.blog.getBlogDetails({ _id });
      console.log("Blog details response:", response);

      if (response) {
        setPostData(response);
        setFormData({
          title: response.title || "",
          author: response.author || "",
          url: response.url || "",
          meta_title: response.meta_title || "",
          meta_description: response.meta_description || "",
          meta_keywords: response.meta_keywords || "",
          short_description: response.short_description || "",
          main_content: response.main_content || "",
          image_file: null, // We'll handle existing image separately
        });

        // Set existing image preview if available
        if (response.image) {
          setImagePreview(response.image);
        }
      }
    } catch (error) {
      console.error("Error fetching blog details:", error);
      toast.error("Failed to load blog details");
    }
  };

  useEffect(() => {
    getPostDetails();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prevState) => ({
        ...prevState,
        image_file: file,
      }));
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      author: "",
      url: "",
      meta_title: "",
      meta_description: "",
      meta_keywords: "",
      short_description: "",
      main_content: "",
      image_file: null,
    });
    setImagePreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (
      !formData.title ||
      !formData.author ||
      !formData.url ||
      !formData.meta_title ||
      !formData.meta_description ||
      !formData.meta_keywords ||
      !formData.main_content
    ) {
      toast.error("All fields are required.");
      return;
    }

    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      // For image file, try both image_file and image field names
      if (key === "image_file" && formData[key]) {
        data.append("image_file", formData[key]);
        data.append("image", formData[key]); // Also try 'image' field name
      } else {
        data.append(key, formData[key]);
      }
    });

    // Debug: Log what's being sent
    console.log("Form data being sent:", Object.fromEntries(data.entries()));
    console.log("Image file object:", formData.image_file);
    console.log("Blog ID:", _id);

    setIsSubmitting(true);
    try {
      console.log("Sending update request to API...");
      const response = await API.blog.updateBlog(data, _id);

      console.log("API Response:", response);
      console.log("Response type:", typeof response);
      console.log(
        "Response keys:",
        response ? Object.keys(response) : "No response"
      );
      console.log("Response.success:", response?.success);
      console.log("Response.message:", response?.message);
      console.log("Response.status:", response?.status);
      console.log("Response._id:", response?._id);
      console.log("Response.title:", response?.title);
      console.log("Response.error:", response?.error);
      console.log("Full response object:", JSON.stringify(response, null, 2));

      // Check if response exists and is successful
      if (response) {
        // Check for different possible success indicators
        if (
          response.success === true ||
          response.message?.toLowerCase().includes("success") ||
          response.status === "success" ||
          response.message?.toLowerCase().includes("updated") ||
          response.message?.toLowerCase().includes("modified") ||
          response.message?.toLowerCase().includes("blog") ||
          response._id || // If response has _id, it's likely successful
          response.title || // If response has title, it's likely successful
          (typeof response === "object" &&
            Object.keys(response).length > 0 &&
            !response.error)
        ) {
          toast.success("Blog updated successfully!");
          resetForm();
          router.push("/dashboard/blogs");
        } else {
          // Check if it's actually an error response
          const errorMessage =
            response?.message ||
            response?.error ||
            "Failed to update the blog. Please try again.";
          toast.error(errorMessage);
          console.error("API Error:", response);
        }
      } else {
        // If response is null/undefined, it might be an error
        toast.error("Failed to update the blog. Please try again.");
        console.error("API Error: No response received");
      }
    } catch (error) {
      toast.error("Failed to update the blog. Please try again.");
      console.error("Error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Card className="w-full mx-auto shadow-none border bg-[#FBFBFB] h-[calc(100vh-100px)] flex flex-col">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 border-b py-3 flex-shrink-0">
          <CardTitle className="text-[#18181B] text-base font-semibold flex items-center gap-2">
            <Link
              href={"/dashboard/blogs"}
              className="bg-white p-2 border rounded-md"
            >
              <Image
                src={"/assets/images/back-icon.svg"}
                className="w-4 h-3"
                width={100}
                height={100}
                alt="back-icon"
              />
            </Link>
            Edit Blog Post
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsPreviewOpen(true)}
          >
            <Eye className="w-4 h-4" />
            Preview
          </Button>
        </CardHeader>
        <CardContent className="py-2 px-4 flex-1 overflow-y-auto custom-scrollbar">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Image Upload */}
            <div className="space-y-2">
              <Label htmlFor="image_file">Featured Image*</Label>
              <div className="flex items-center gap-4">
                <div className="relative w-full h-40 border-2 border-dashed rounded-lg flex flex-col  gap-y-4 items-center justify-center overflow-hidden">
                  {imagePreview ? (
                    <Image
                      src={imagePreview}
                      width={200}
                      height={200}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <>
                      <ImagePlus className="w-10 h-10 text-muted-foreground" />
                      <div className="text-sm text-muted-foreground">
                        Drag and drop or click to upload
                        <br />
                        Recommended size: 1200x630px
                      </div>
                    </>
                  )}

                  <input
                    type="file"
                    id="image_file"
                    name="image_file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Title */}
            <div className="space-y-1">
              <Label htmlFor="title" className="text-[#4A4A4B]">
                Title*
              </Label>
              <Input
                id="title"
                name="title"
                placeholder="Enter blog post title"
                value={formData.title}
                className="h-11"
                onChange={handleInputChange}
              />
            </div>

            {/* Author */}
            <div className="space-y-1">
              <Label htmlFor="author" className="text-[#4A4A4B]">
                Author*
              </Label>
              <Input
                id="author"
                name="author"
                placeholder="Enter author name"
                className="h-11"
                value={formData.author}
                onChange={handleInputChange}
              />
            </div>
            {/* Url */}
            <div className="space-y-1">
              <Label htmlFor="author" className="text-[#4A4A4B]">
                Url*
              </Label>
              <Input
                id="url"
                name="url"
                placeholder="Enter your url"
                className="h-11"
                value={formData.url}
                onChange={handleInputChange}
              />
            </div>

            {/* Meta Title */}
            <div className="space-y-1">
              <Label htmlFor="meta_title" className="text-[#4A4A4B]">
                Meta Title*
              </Label>
              <Input
                id="meta_title"
                name="meta_title"
                placeholder="Enter SEO meta title"
                className="h-11"
                value={formData.meta_title}
                onChange={handleInputChange}
              />
            </div>

            {/* Meta Description */}
            <div className="space-y-1">
              <Label htmlFor="meta_description" className="text-[#4A4A4B]">
                Meta Description*
              </Label>
              <Textarea
                id="meta_description"
                name="meta_description"
                placeholder="Enter SEO meta description"
                className="h-11"
                value={formData.meta_description}
                onChange={handleInputChange}
              />
            </div>

            {/* Meta Keywords */}
            <div className="space-y-1">
              <Label htmlFor="meta_description" className="text-[#4A4A4B]">
                Meta Keywords*
              </Label>
              <Textarea
                id="meta_keywords"
                name="meta_keywords"
                placeholder="Enter SEO meta keywords"
                className="h-11"
                value={formData.meta_keywords}
                onChange={handleInputChange}
              />
            </div>

            {/* Short Description */}
            <div className="space-y-1">
              <Label htmlFor="short_description" className="text-[#4A4A4B]">
                Short Description*
              </Label>
              <Textarea
                id="short_description"
                name="short_description"
                placeholder="Enter a brief description of the blog post"
                className="h-11"
                value={formData.short_description}
                onChange={handleInputChange}
              />
            </div>

            {/* Main Content */}
            <div className="space-y-1">
              <Label htmlFor="main_content" className="text-[#4A4A4B]">
                Main Content*
              </Label>
              <RichTextEditor
                name="main_content"
                initialContent={formData.main_content}
                onChange={(content) =>
                  setFormData((prevState) => ({
                    ...prevState,
                    main_content: content,
                  }))
                }
              />
            </div>

            {/* Submit Button */}
            <div className="flex justify-end gap-4">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-[#41A3FF] text-sm px-4 hover:bg-[#41A3FF]/90 flex items-center"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Publishing...
                  </>
                ) : (
                  "Edit Blog Post"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <BlogPreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        title={formData.title}
        author={formData.author}
        shortDescription={formData.short_description}
        content={formData.main_content}
        imageUrl={imagePreview}
      />
    </>
  );
};

export default EditBlogPost;
