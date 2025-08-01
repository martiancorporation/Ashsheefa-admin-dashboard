"use client";

import { useState } from "react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Trash2, Loader2 } from "lucide-react";
import useAuthDataStore from "@/store/authStore";
import API from "@/api";
import { toast } from "sonner";

export function DeleteNews({ newsId, newsTitle, onDelete }) {
    const [loading, setLoading] = useState(false);
    const authData = useAuthDataStore((state) => state.authData);

    const handleDelete = async () => {
        setLoading(true);
        try {
            console.log("Deleting news with ID:", newsId);
            const response = await API.news.deleteNews({
                _id: newsId,
            });

            console.log("Delete response:", response);

            if (response?.success) {
                toast.success("News deleted successfully");
                onDelete();
            } else {
                toast.error(response?.message || "Failed to delete news");
            }
        } catch (error) {
            console.error("Error deleting news:", error);
            toast.error("An error occurred while deleting the news");
        } finally {
            setLoading(false);
        }
    };

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button
                    variant="outline"
                    size="sm"
                    className="h-8 w-8 p-0"
                >
                    <Trash2 className="w-4 h-4" />
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Delete News Article</AlertDialogTitle>
                    <AlertDialogDescription>
                        Are you sure you want to delete "{newsTitle}"? This action cannot be undone.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleDelete}
                        disabled={loading}
                        className="bg-red-600 hover:bg-red-700"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Deleting...
                            </>
                        ) : (
                            "Delete"
                        )}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
} 