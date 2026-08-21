import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { getSocialIcon } from "@/lib/socialMedia"


export function BlogPreviewModal({
    isOpen,
    onClose,
    title,
    author,
    shortDescription,
    content,
    imageUrl,
    socialLinks = []
}) {
    const links = (Array.isArray(socialLinks) ? socialLinks : [])
        .map((s) => (typeof s === "string" ? s : s?.url))
        .filter((u) => u && u.trim() !== "");

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl h-[90vh]">
                <DialogHeader>
                    <DialogTitle>Blog Preview</DialogTitle>
                </DialogHeader>
                <ScrollArea className="h-full pr-4">
                    {imageUrl && (
                        <div className="aspect-video w-full mb-6 rounded-lg overflow-hidden">
                            <img
                                src={imageUrl}
                                alt={title}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    )}
                    <div className="space-y-4">
                        <h1 className="text-3xl font-bold">{title}</h1>
                        <div className="text-sm text-muted-foreground">
                         { author ?   `By ${author}` : ''}
                        </div>
                        
                        <p className="text-lg text-muted-foreground">
                            {shortDescription}
                        </p>
                        <div
                            className="prose prose-stone max-w-none"
                            dangerouslySetInnerHTML={{ __html: content }}
                        />

                        {/* Social Media Links (bottom-left) */}
                        {links.length > 0 && (
                            <div className="border-t pt-4">
                                <div className="flex items-center gap-3">
                                    {links.map((url, i) => {
                                        const Icon = getSocialIcon(url);
                                        return (
                                            <a
                                                key={i}
                                                href={url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                title={url}
                                                className="flex h-10 w-10 items-center justify-center rounded-md border text-gray-600 hover:text-blue-600 hover:border-blue-300 transition-colors"
                                            >
                                                <Icon className="w-5 h-5" />
                                            </a>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    )
}

