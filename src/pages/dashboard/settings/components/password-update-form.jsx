import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"
import useAuthDataStore from "@/store/authStore"
import auth from "@/api/auth"

const EMPTY = { old_password: "", new_password: "", confirm_password: "" }

export function PasswordUpdateForm() {
    const [loading, setLoading] = useState(false)
    const [isEditing, setIsEditing] = useState(false)
    const authData = useAuthDataStore((state) => state.authData)

    const [formData, setFormData] = useState(EMPTY)

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    // Cancel editing: clear the fields and lock them again.
    const handleCancel = () => {
        setFormData(EMPTY)
        setIsEditing(false)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        // Validation
        if (!formData.old_password.trim()) {
            toast.error("Old password is required")
            return
        }
        if (!formData.new_password.trim()) {
            toast.error("New password is required")
            return
        }
        if (!formData.confirm_password.trim()) {
            toast.error("Confirm password is required")
            return
        }
        if (formData.new_password !== formData.confirm_password) {
            toast.error("New passwords do not match")
            return
        }
        if (formData.new_password.length < 6) {
            toast.error("New password must be at least 6 characters long")
            return
        }

        setLoading(true)
        try {
            const response = await auth.UpdatePassword({
                token: authData?.access_token,
                old_password: formData.old_password,
                new_password: formData.new_password,
                confirm_password: formData.confirm_password,
            })


            // Check if response exists (successful update)
            if (response) {
                toast.success("Password updated successfully")
                // Reset form
                setFormData(EMPTY)
                setIsEditing(false)
            } else {
                toast.error("Failed to update password")
            }
        } catch (error) {
            console.error("Error updating password:", error)
            // Only show error toast if it's not already handled by handleResponse
            if (!error?.response) {
                toast.error("An error occurred while updating password")
            }
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-3">
            <div className="space-y-3">
                <div className="space-y-1">
                    <Label htmlFor="old_password" className={`text-[#4A4A4B] text-sm`}>Old Password*</Label>
                    <Input
                        id="old_password"
                        name="old_password"
                        type="password"
                        value={formData.old_password}
                        onChange={handleChange}
                        placeholder="Enter Old Password"
                        required
                        className={`bg-[#FBFBFB] rounded-[6px] border-[#DDDDDD] shadow-none disabled:cursor-not-allowed`}
                        disabled={loading || !isEditing}
                    />
                </div>

                <div className="space-y-1">
                    <Label htmlFor="new_password" className={`text-[#4A4A4B] text-sm`}>New Password*</Label>
                    <Input
                        id="new_password"
                        name="new_password"
                        type="password"
                        value={formData.new_password}
                        onChange={handleChange}
                        placeholder="Enter New Password"
                        required
                        className={`bg-[#FBFBFB] rounded-[6px] border-[#DDDDDD] shadow-none disabled:cursor-not-allowed`}
                        disabled={loading || !isEditing}
                    />
                </div>

                <div className="space-y-1">
                    <Label htmlFor="confirm_password" className={`text-[#4A4A4B] text-sm`}>Confirm Password*</Label>
                    <Input
                        id="confirm_password"
                        name="confirm_password"
                        type="password"
                        value={formData.confirm_password}
                        onChange={handleChange}
                        placeholder="Confirm New Password"
                        required
                        className={`bg-[#FBFBFB] rounded-[6px] border-[#DDDDDD] shadow-none disabled:cursor-not-allowed`}
                        disabled={loading || !isEditing}
                    />
                </div>
            </div>

            <div className="relative h-10">
                {/* View mode: Edit button */}
                <div
                    className={`absolute right-0 top-0 transition-all duration-500 ease-in-out ${isEditing
                        ? "opacity-0 translate-x-3 pointer-events-none"
                        : "opacity-100 translate-x-0"
                        }`}
                >
                    <Button
                        type="button"
                        onClick={() => setIsEditing(true)}
                        className="bg-[#005CD4] text-sm hover:bg-blue-700 rounded-[6px] font-normal border-transparent px-8"
                    >
                        Edit
                    </Button>
                </div>

                {/* Edit mode: Cancel + Save */}
                <div
                    className={`absolute right-0 top-0 flex gap-4 transition-all duration-500 ease-in-out ${isEditing
                        ? "opacity-100 translate-x-0"
                        : "opacity-0 translate-x-3 pointer-events-none"
                        }`}
                >
                    <Button
                        type="button"
                        variant="outline"
                        onClick={handleCancel}
                        className={`border-none bg-transparent shadow-none`}
                        disabled={loading}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        className="bg-[#005CD4] text-sm hover:bg-blue-700 rounded-[6px] font-normal border-transparent px-8"
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Updating...
                            </>
                        ) : (
                            "Save Details"
                        )}
                    </Button>
                </div>
            </div>
        </form>
    )
}
