"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function LoginForm() {
    const [buttonLoading, setButtonLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(true);
    const handleClick = () => {
        setShowPassword(!showPassword);
    };

    // ****************************** Login Submit Form Api Call *************************

    return (
        <form
            className={
                "w-full h-full flex flex-col items-center justify-center gap-6 "
            }
        >
            <div className="w-full flex flex-col items-center justify-center gap-0 text-center">
                <h1 className="text-2xl font-semibold text-[#323232]">
                    Login to Account
                </h1>
                <p className="text-balance text-base text-[#323232]">
                    Please enter your email and password to continue
                </p>
            </div>
            <div className="w-full  flex flex-col items-center justify-center gap-y-5 pt-2 px-4">
                <div className="w-full max-w-sm  flex flex-col gap-y-2">
                    <Label htmlFor="email" className="text-[#4A4A4B] font-normal">
                        Email Address*
                    </Label>
                    <div>
                        <Input
                            id="email"
                            type="email"
                            className="rounded-[6px] bg-[#FBFBFB] border-[#DDDDDD] placeholder:text-sm h-11 placeholder:text-[#9D9999]"
                            placeholder="Enter email"
                        // {...register("email", { required: true })}
                        />
                        {/* {errors.email && (
                            <span className="mt-1 text-[12px] text-meta-1 text-red-500 flex items-center gap-1">
                                Email Id is required.
                            </span>
                        )} */}
                    </div>
                </div>
                <div className="w-full max-w-sm  flex flex-col gap-y-2">
                    <div className="flex items-center">
                        <Label htmlFor="password" className="text-[#4A4A4B] font-normal">
                            Password*
                        </Label>
                        <Dialog>
                            <DialogTrigger className="ml-auto text-xs text-[#005CD4]">Forgot password?</DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle className='text-base'>Forgot your password?</DialogTitle>
                                    <DialogDescription className='text-sm'>

                                        Connect with our technical team for assistance.

                                    </DialogDescription>
                                </DialogHeader>
                            </DialogContent>
                        </Dialog>
                    </div>
                    <div className="flex flex-col w-full items-start relative ">
                        <Input
                            id="password"
                            type={showPassword ? "password" : "text"}
                            className="rounded-[6px] bg-[#FBFBFB] border-[#DDDDDD] placeholder:text-sm h-11 placeholder:text-[#9D9999]"
                            placeholder="Enter Password"
                        // {...register("password", { required: true })}
                        />
                        <div className="text-gray-600 absolute right-3 top-2.5 cursor-pointer">
                            {showPassword ? (
                                <Eye
                                    onClick={handleClick}
                                    className="w-5 text-[#C0C0C0] transition-all"
                                />
                            ) : (
                                <EyeOff
                                    onClick={handleClick}
                                    className="w-5 text-[#C0C0C0] transition-all"
                                />
                            )}
                        </div>
                        {/* {errors.password && (
                            <span className="mt-1 text-[12px] text-meta-1 text-red-500 flex items-center gap-1">
                                Password is required.
                            </span>
                        )} */}
                    </div>
                </div>

                <Button
                    type="submit"
                    className="w-full bg-[#005CD4] rounded-[6px] hover:bg-blue-600 transition-all max-w-sm h-11"
                >
                    {buttonLoading ? (
                        <div className="flex items-center gap-1">
                            <svg
                                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                ></circle>
                                <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                ></path>
                            </svg>
                            Loading
                        </div>
                    ) : (
                        "Log In"
                    )}
                </Button>
            </div>
        </form>
    );
}
