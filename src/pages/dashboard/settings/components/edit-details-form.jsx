import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"
import useAuthDataStore from "@/store/authStore"
import auth from "@/api/auth"
import { z } from "zod"

const detailsSchema = z.object({
    first_name: z
        .string()
        .transform((v) => v.replace(/[^a-zA-Z\s]/g, "").replace(/\s+/g, " ").trim())
        .refine((v) => /^[A-Za-z]+(?: [A-Za-z]+)*$/.test(v), {
            message: "Please enter a valid first name",
        }),
    last_name: z
        .string()
        .transform((v) => v.replace(/[^a-zA-Z\s]/g, "").replace(/\s+/g, " ").trim())
        .refine((v) => /^[A-Za-z]+(?: [A-Za-z]+)*$/.test(v), {
            message: "Please enter a valid last name",
        }),
    phone_number: z
        .string()
        .refine((v) => /^\d{10}$/.test(v.replace(/\D/g, "")), {
            message: "Please enter a valid 10-digit phone number",
        }),
})

// Reduce any stored value (e.g. "+91 2355658454") to the 10-digit local number.
const toLocal10 = (v) => (v || "").replace(/\D/g, "").slice(-10)

export function EditDetailsForm() {
    const [loading, setLoading] = useState(false)
    const [errors, setErrors] = useState({})
    const [isEditing, setIsEditing] = useState(false)
    const authData = useAuthDataStore((state) => state.authData)
    const setAuthData = useAuthDataStore((state) => state.setAuthData)

    // Build the form state from the currently-saved auth data.
    const buildFromAuth = () => ({
        first_name: authData?.first_name || "Farukuddin",
        last_name: authData?.last_name || "Purkaite",
        phone_number: toLocal10(authData?.phone_number) || "2355658454",
    })

    const [formData, setFormData] = useState(buildFromAuth())

    // Initialize form with current user data (only while not actively editing,
    // so an external auth refresh doesn't wipe in-progress edits).
    useEffect(() => {
        if (authData && !isEditing) {
            setFormData(buildFromAuth())
        }
    }, [authData])

    // Cancel editing: discard changes, restore saved data, disable fields.
    const handleCancel = () => {
        setFormData(buildFromAuth())
        setErrors({})
        setIsEditing(false)
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        let v = value
        if (name === "first_name" || name === "last_name") {
            v = value.replace(/[^a-zA-Z\s]/g, "").replace(/\s+/g, " ").trimStart()
        } else if (name === "phone_number") {
            v = value.replace(/\D/g, "").slice(0, 10)
        }
        setFormData((prev) => ({ ...prev, [name]: v }))
        if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        // Validate with zod
        const parsed = detailsSchema.safeParse(formData)
        if (!parsed.success) {
            const fieldErrors = {}
            parsed.error.issues.forEach((i) => {
                if (!fieldErrors[i.path[0]]) fieldErrors[i.path[0]] = i.message
            })
            setErrors(fieldErrors)
            toast.error(parsed.error.issues[0].message)
            return
        }
        setErrors({})

        setLoading(true)
        try {
            const response = await auth.UpdateAdminDetails({
                token: authData?.access_token,
                first_name: formData.first_name.trim(),
                last_name: formData.last_name.trim(),
                phone_number: formData.phone_number.trim(),
            })


            // Check if response exists and has user data (successful update)
            if (response && response.user) {
                toast.success("Admin details updated successfully")

                // Update the auth store with new data
                const updatedAuthData = {
                    ...authData,
                    first_name: response.user.first_name,
                    last_name: response.user.last_name,
                    phone_number: response.user.phone_number,
                }
                setAuthData(updatedAuthData)

                // Update local form data to reflect changes
                setFormData({
                    first_name: response.user.first_name,
                    last_name: response.user.last_name,
                    phone_number: toLocal10(response.user.phone_number),
                })
                setIsEditing(false)
            } else if (response && response.message) {
                // If response has message but no user data, it might still be successful
                toast.success(response.message)
            } else {
                // If no response or no user data, it's an error
                toast.error("Failed to update admin details")
            }
        } catch (error) {
            console.error("Error updating admin details:", error)
            // Only show error toast if it's not already handled by handleResponse
            if (!error?.response) {
                toast.error("An error occurred while updating details")
            }
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="first_name" className={`text-[#4A4A4B] text-sm`}>First name*</Label>
                    <Input
                        id="first_name"
                        name="first_name"
                        value={formData.first_name}
                        onChange={handleChange}
                        placeholder="Enter name"
                        required
                        className={`bg-[#FBFBFB] rounded-[6px] border-[#DDDDDD] shadow-none disabled:opacity-100 disabled:cursor-not-allowed`}
                        disabled={loading || !isEditing}
                    />
                    {errors.first_name && (
                        <p className="text-xs text-red-500">{errors.first_name}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="last_name" className={`text-[#4A4A4B] text-sm`}>Last name*</Label>
                    <Input
                        id="last_name"
                        name="last_name"
                        value={formData.last_name}
                        onChange={handleChange}
                        placeholder="Enter name"
                        required
                        className={`bg-[#FBFBFB] rounded-[6px] border-[#DDDDDD] shadow-none disabled:opacity-100 disabled:cursor-not-allowed`}
                        disabled={loading || !isEditing}
                    />
                    {errors.last_name && (
                        <p className="text-xs text-red-500">{errors.last_name}</p>
                    )}
                </div>
            </div>

            <div className="space-y-2 mb-6">
                <Label htmlFor="phone_number" className={`text-[#4A4A4B] text-sm`}>Contact Number</Label>
                <Input
                    id="phone_number"
                    name="phone_number"
                    value={formData.phone_number}
                    onChange={handleChange}
                    placeholder="Enter number"
                    maxLength={10}
                    className={`bg-[#FBFBFB] rounded-[6px] border-[#DDDDDD] shadow-none disabled:opacity-100 disabled:cursor-not-allowed`}
                    disabled={loading || !isEditing}
                />
                {errors.phone_number && (
                    <p className="text-xs text-red-500">{errors.phone_number}</p>
                )}
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
                                Saving...
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
