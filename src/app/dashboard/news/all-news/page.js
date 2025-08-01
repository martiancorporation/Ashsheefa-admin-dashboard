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
import { DeleteNews } from "./delete-news";
import { NewsPreviewModal } from "./preview-modal";

export default function AllNews() {
  const [loading, setLoading] = useState(false);
  const [news, setNews] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const authData = useAuthDataStore((state) => state.authData);

  useEffect(() => {
    getAllNews();
  }, []);

  const getAllNews = () => {
    setLoading(true);
    API.news
      .getAllNews()
      .then((response) => {
        console.log("All news response:", response);
        if (response?.data) {
          setNews(response.data);
        }
      })
      .catch((error) => {
        console.error("Error fetching news:", error);
        toast.error("Failed to fetch news");
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
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const filteredNews = news.filter(
    (item) =>
      item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.news_channel_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full h-full flex flex-col">
      {/* Header Section */}
      <div className="w-full flex items-center justify-between">
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
          <p className="text-[#4B4B4B] font-medium">News</p>
        </div>

        <div className="flex flex-row justify-between items-center gap-4">
          <div className="flex gap-3 w-full md:w-auto">
            <Button
              variant="outline"
              className="flex items-center gap-2 text-[#4B4B4B] cursor-pointer"
              disabled={loading}
              onClick={getAllNews}
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
              <Link href="/dashboard/news/create-news">
                <Plus className="h-4 w-4" />
                Add News
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Search Section */}
      <div className="w-full flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mt-6">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search news..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="text-sm text-gray-500">
          {filteredNews.length} news articles found
        </div>
      </div>

      {/* Table Section */}
      <div className="mt-6">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">No</TableHead>
                <TableHead className="w-[80px]">Image</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>News Channel</TableHead>
                <TableHead>Publish Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredNews.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8">
                    <div className="flex flex-col items-center gap-2">
                      <Image
                        src="/assets/images/blogs/empty-box.png"
                        alt="No news"
                        width={64}
                        height={64}
                        className="opacity-50"
                      />
                      <p className="text-gray-500">No news articles found</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredNews.map((item, index) => (
                  <TableRow key={item._id}>
                    <TableCell className="font-medium">
                      {item.no || index + 1}
                    </TableCell>
                    <TableCell>
                      {item.image ? (
                        <div className="w-12 h-12 rounded-md overflow-hidden border border-gray-200">
                          <Image
                            src={item.image}
                            alt={item.title}
                            width={48}
                            height={48}
                            className="w-full h-full object-cover"
                            unoptimized={item.image.startsWith("data:")}
                          />
                        </div>
                      ) : (
                        <div className="w-12 h-12 rounded-md bg-gray-100 flex items-center justify-center border border-gray-200">
                          <svg
                            className="w-6 h-6 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="max-w-[200px]">
                      <div className="truncate" title={item.title}>
                        {item.title}
                      </div>
                    </TableCell>
                    <TableCell className="max-w-[300px]">
                      <div className="truncate" title={item.description}>
                        {truncateDescription(item.description, 10)}
                      </div>
                    </TableCell>
                    <TableCell>{item.news_channel_name}</TableCell>
                    <TableCell>{formatDate(item.publish_date)}</TableCell>
                    <TableCell>
                      <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                        Published
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <NewsPreviewModal news={item} />
                        <Link href={`/dashboard/news/edit/${item._id}`}>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 w-8 p-0"
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                        </Link>
                        <DeleteNews
                          newsId={item._id}
                          newsTitle={item.title}
                          onDelete={getAllNews}
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}
