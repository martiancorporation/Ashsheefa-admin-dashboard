import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"



export function LinkModal({ isOpen, onClose, onSubmit }) {
    const [url, setUrl] = useState("")
    const [text, setText] = useState("")

    const handleSubmit = (e) => {
        e.preventDefault()
        onSubmit(url, text)
        setUrl("")
        setText("")
        onClose()
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add Link</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="flex flex-col gap-4 py-4">
                        <div className="flex items-center gap-4">
                            <Label htmlFor="url" className="text-right">
                                URL
                            </Label>
                            <Input id="url" value={url} onChange={(e) => setUrl(e.target.value)} className="h-10" placeholder='Enter your link here ..'/>
                        </div>
                        <div className="flex items-center gap-4">
                            <Label htmlFor="text" className="text-right">
                                Text
                            </Label>
                            <Input id="text" value={text} onChange={(e) => setText(e.target.value)} className="h-10" placeholder='Enter suitable text here ..' />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button className='bg-blue-500 rounded-sm px-4 hover:bg-blue-600 transition-all h-9' type="submit">Add Link</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}

