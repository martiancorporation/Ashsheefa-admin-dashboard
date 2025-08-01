"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"


export function BlogPreviewModal({
    isOpen,
    onClose,
    title,
    author,
    shortDescription,
    content,
    imageUrl
}) {
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
                    </div>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    )
}

