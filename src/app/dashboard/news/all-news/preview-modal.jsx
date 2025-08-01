"use client";

import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Eye, Calendar, Newspaper, Image as ImageIcon } from "lucide-react";
import Image from "next/image";

export function NewsPreviewModal({ news }) {
    const [open, setOpen] = useState(false);

    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            day: "2-digit",
            month: "long",
            year: "numeric",
        });
    };

    // Handle single image
    const hasImage = news.image && news.image.trim() !== '';

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    variant="outline"
                    size="sm"
                    className="h-8 w-8 p-0"
                >
                    <Eye className="w-4 h-4" />
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-xl font-semibold text-gray-900">
                        News Preview
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-6">
                    {/* News Header */}
                    <div className="border-b pb-4">
                        <h1 className="text-2xl font-bold text-gray-900 mb-4">
                            {news.title}
                        </h1>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                                <Newspaper className="w-4 h-4" />
                                <span>{news.news_channel_name}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                <span>{formatDate(news.publish_date)}</span>
                            </div>
                        </div>
                    </div>

                    {/* News Image */}
                    {hasImage && (
                        <div className="space-y-4">
                            <div className="flex items-center gap-2">
                                <ImageIcon className="w-5 h-5 text-gray-600" />
                                <h3 className="text-lg font-semibold text-gray-900">
                                    News Image
                                </h3>
                            </div>
                            <div className="relative aspect-video rounded-lg overflow-hidden border">
                                <Image
                                    src={news.image}
                                    alt={news.title}
                                    fill
                                    className="object-cover"
                                    unoptimized={news.image.startsWith('data:')}
                                    onError={(e) => {
                                        e.target.style.display = 'none';
                                        e.target.nextSibling.style.display = 'flex';
                                    }}
                                />
                                <div
                                    className="hidden absolute inset-0 bg-gray-100 flex items-center justify-center text-gray-500"
                                    style={{ display: 'none' }}
                                >
                                    <div className="text-center">
                                        <ImageIcon className="w-8 h-8 mx-auto mb-2" />
                                        <p className="text-sm">Image not available</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* News Content */}
                    <div className="space-y-4">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                Description
                            </h3>
                            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                                {news.description}
                            </p>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
} 