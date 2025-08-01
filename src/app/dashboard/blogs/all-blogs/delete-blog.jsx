/* eslint-disable react/prop-types */
import API from "@/api";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogDescription,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import useAuthDataStore from "@/store/authStore";
import { Trash2, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export const DeleteBlog = ({ blog, getAllBlogs }) => {
  const [buttonLoading, setButtonLoading] = useState(false);
  const authData = useAuthDataStore((state) => state.authData);

  const deleteBlog = () => {
    setButtonLoading(true);
    const data = {
      ...blog,
    };

    API.blog
      .deleteBlog(authData?.access_token, data)
      .then((response) => {
        if (response) {
          toast.success("Blog post deleted successfully");
          getAllBlogs(authData?.access_token);
        }
      })
      .catch((error) => {
        toast.error("Failed to delete blog post");
        console.error("Delete error:", error);
      })
      .finally(() => {
        setButtonLoading(false);
      });
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 hover:bg-red-50"
        >
          <Trash2 className="h-4 w-4 text-red-600" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-lg font-semibold">
            Delete Blog Post
          </AlertDialogTitle>
          <AlertDialogDescription className="text-gray-600">
            Are you sure you want to delete "{blog?.title}"? This action cannot be undone and will permanently remove the blog post from your system.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="gap-3">
          <AlertDialogCancel className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
            onClick={deleteBlog}
            disabled={buttonLoading}
          >
            {buttonLoading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Deleting...
              </div>
            ) : (
              "Delete Blog"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
