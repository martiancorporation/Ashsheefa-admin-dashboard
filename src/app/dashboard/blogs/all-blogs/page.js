"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Eye,
  Loader2,
  Pencil,
  Trash2,
  Search,
  Plus,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import useAuthDataStore from "@/store/authStore";
import API from "@/api";
import { DeleteBlog } from "./delete-blog";
import { BlogPreviewModal } from "./preview-model";

export default function AllBlogs() {
  const [loading, setLoading] = useState(false);
  const [blogs, setBlogs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const authData = useAuthDataStore((state) => state.authData);

  useEffect(() => {
    getAllBlogs();
  }, []);

  const getAllBlogs = () => {
    setLoading(true);
    API.blog
      .getAllBlogs()
      .then((response) => {
        if (response) {
          setBlogs(response);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const truncateDescription = (text, wordLimit) => {
    if (!text) return "";
    const words = text.split(" ");
    return words.length > wordLimit
      ? words.slice(0, wordLimit).join(" ") + "..."
      : text;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "17 Jan 2022"; // Default date as shown in screenshot
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const filteredBlogs = blogs.filter(
    (blog) =>
      blog.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.meta_description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.author?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full h-full flex flex-col">
      {/* Header Section */}
      <div className="w-full flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Link
            href="/dashboard/blogs"
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
          <p className="text-[#4B4B4B] font-medium">Blogs</p>
        </div>

        <div className="flex flex-row justify-between items-center gap-4">
          <div className="relative w-full md:w-auto md:min-w-[320px]">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search here..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 rounded-md border border-gray-300"
              disabled={loading}
            />
          </div>
          <div className="flex gap-3 w-full md:w-auto">
            <Button
              variant="outline"
              className="flex items-center gap-2 text-[#4B4B4B] cursor-pointer"
              disabled={loading}
              onClick={getAllBlogs}
            >
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Refresh
            </Button>
            <Button
              className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2 ml-auto md:ml-0 cursor-pointer"
              disabled={loading}
              asChild
            >
              <Link href="/dashboard/blogs/create-blog">
                <Plus className="h-4 w-4" />
                Add Blog
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="h-[calc(100vh-200px)] overflow-y-auto overscroll-y-contain pt-6 custom-scrollbar">
        {/* Table Section */}
        <div className="flex-1 overflow-hidden px-0 pb-6">
          <div className="bg-white rounded-lg overflow-hidden h-full">
            <div className="overflow-x-auto h-full">
              <Table className="w-full h-full border-collapse">
                <TableHeader>
                  <TableRow className="bg-gray-50 border overflow-x-auto border-gray-200">
                    <TableHead className="font-medium text-gray-700 w-20 border-r border-gray-200 py-3">
                      Image
                    </TableHead>
                    <TableHead className="font-medium text-gray-700 min-w-[200px] border-r border-gray-200 py-3">
                      Title
                    </TableHead>
                    <TableHead className="font-medium text-gray-700 min-w-[250px] border-r border-gray-200 py-3">
                      Description
                    </TableHead>
                    <TableHead className="font-medium text-gray-700 min-w-[150px] border-r border-gray-200 py-3">
                      Author
                    </TableHead>
                    <TableHead className="font-medium text-gray-700 min-w-[120px] border-r border-gray-200 py-3">
                      Post Date
                    </TableHead>
                    <TableHead className="font-medium text-gray-700 text-center w-32 py-3">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        className="text-center py-8 border border-gray-200"
                      >
                        <div className="flex justify-center items-center">
                          <Loader2 className="w-6 h-6 animate-spin text-blue-600 mr-2" />
                          <span className="text-gray-500">
                            Loading blogs...
                          </span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : filteredBlogs && filteredBlogs.length > 0 ? (
                    filteredBlogs.map((blog, index) => (
                      <TableRow
                        key={blog?._id}
                        className="hover:bg-blue-50 border border-gray-100 transition-all duration-200 "
                      >
                        <TableCell className="py-3 border  border-gray-200  transition-colors duration-200">
                          <div className="w-16 h-12 rounded-md overflow-hidden bg-gray-100 flex-shrink-0">
                            {blog?.image ? (
                              <Image
                                src={blog.image}
                                alt={blog.title}
                                width={64}
                                height={48}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-gray-200">
                                <span className="text-xs text-gray-500">
                                  No Image
                                </span>
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="font-medium text-gray-900 border border-gray-200 py-3 group-hover:border-blue-300 transition-colors duration-200">
                          <div
                            className="truncate max-w-[200px]"
                            title={blog?.title}
                          >
                            {blog?.title}
                          </div>
                        </TableCell>
                        <TableCell className="text-gray-600 border border-gray-200 py-3  transition-colors duration-200">
                          <div
                            className="truncate max-w-[250px]"
                            title={blog?.meta_description}
                          >
                            {truncateDescription(blog?.meta_description, 8)}
                          </div>
                        </TableCell>
                        <TableCell className="text-gray-600 border border-gray-200 py-3  transition-colors duration-200">
                          <div
                            className="truncate max-w-[150px]"
                            title={blog?.author || "Aasheefa Hospital"}
                          >
                            {blog?.author || "Aasheefa Hospital"}
                          </div>
                        </TableCell>
                        <TableCell className="text-gray-600 border border-gray-200 py-3 transition-colors duration-200">
                          {formatDate(blog?.createdAt)}
                        </TableCell>
                        <TableCell className="py-3 border border-gray-200">
                          <div className="flex items-center justify-center gap-1">
                            <BlogPreviewModal blog={blog} />
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 hover:bg-green-50"
                              asChild
                            >
                              <Link href={`/dashboard/blogs/edit/${blog?._id}`}>
                                <Pencil className="h-4 w-4 text-green-600" />
                              </Link>
                            </Button>
                            <DeleteBlog blog={blog} getAllBlogs={getAllBlogs} />
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        className="text-center py-8 border-b border-gray-200"
                      >
                        <div className="flex flex-col items-center justify-center">
                          <Image
                            src="/assets/images/blogs/empty-box.png"
                            width={60}
                            height={60}
                            alt="empty-box"
                            className="mb-3"
                          />
                          <p className="text-gray-500">
                            {searchTerm
                              ? "No blogs found matching your search"
                              : "No blogs found"}
                          </p>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
