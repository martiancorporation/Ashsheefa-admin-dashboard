import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Eye, Calendar, User, ExternalLink } from "lucide-react"

export function BlogPreviewModal({ blog }) {
    const formatDate = (dateString) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 hover:bg-blue-50"
                >
                    <Eye className="h-4 w-4 text-blue-600" />
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl h-[90vh] p-0 flex flex-col">
                <DialogHeader className="p-6 pb-0 flex-shrink-0">
                    <DialogTitle className="text-xl font-semibold">Blog Preview</DialogTitle>
                    <DialogDescription>
                        Preview your blog post as it will appear to readers
                    </DialogDescription>
                </DialogHeader>

                <ScrollArea className="flex-1 px-6 pb-6 max-h-[calc(90vh-120px)] blog-content-scrollbar">
                    <div className="space-y-6">
                        {/* Hero Image */}
                        {blog?.image && (
                            <div className="aspect-video w-full rounded-xl overflow-hidden bg-gray-100 shadow-sm">
                                <img
                                    src={blog?.image}
                                    alt={blog?.title}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        )}

                        {/* Blog Header */}
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <h1 className="text-3xl font-bold text-gray-900 leading-tight">
                                    {blog?.title}
                                </h1>
                                <p className="text-lg text-gray-600 leading-relaxed">
                                    {blog?.short_description || blog?.meta_description}
                                </p>
                            </div>

                            {/* Meta Information */}
                            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 border-t border-b border-gray-100 py-4">
                                <div className="flex items-center gap-2">
                                    <User className="w-4 h-4" />
                                    <span className="font-medium">{blog?.author || 'Unknown Author'}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4" />
                                    <span>{formatDate(blog?.createdAt)}</span>
                                </div>
                                <Badge variant="secondary" className="text-xs">
                                    {blog?.status || 'Published'}
                                </Badge>
                            </div>
                        </div>

                        {/* Blog Content */}
                        <div className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-blue-600 prose-strong:text-gray-900 prose-blockquote:border-l-blue-500 prose-blockquote:bg-blue-50 prose-blockquote:py-2 prose-blockquote:px-4 prose-blockquote:rounded-r-lg">
                            <div dangerouslySetInnerHTML={{ __html: blog?.main_content || '<p>No content available</p>' }} />
                        </div>

                        {/* Footer */}
                        <div className="border-t border-gray-100 pt-6">
                            <div className="flex items-center justify-between text-sm text-gray-500">
                                <span>Blog ID: {blog?._id}</span>
                                <div className="flex items-center gap-2">
                                    <ExternalLink className="w-4 h-4" />
                                    <span>Preview Mode</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    )
}
