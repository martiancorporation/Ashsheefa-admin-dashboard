import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function notfound() {
  return (
    <div className="w-full h-[100vh]">
      <div className="px-4 md:px-10 py-6 md:py-8 w-full h-full max-w-[1440px] mx-auto flex flex-col justify-center items-center gap-6">
        <section>
          <Image
            width={500}
            height={500}
            src="/assets/images/not-found.png"
            alt="not-found image"
            className="w-[250px] md:w-[300px]"
          />
        </section>
        <section className="flex flex-col gap-2 justify-center items-center">
          <h4 className="text-xl md:text-3xl font-semibold text-[#000000]">
            Page not Found
          </h4>
          <p className="text-sm md:text-base text-center text-[#7F7879]">
            Oops! The page you&apos;re looking for doesn&apos;t exist.
            Let&apos;s help you find your way back
          </p>
          <Link href={"/"}>
            <Button
              className={`bg-[#3B8BF4] text-[#ffffff] hover:bg-blue-700 hover:text-white cursor-pointer`}
            >
              Back to Dashboard
            </Button>
          </Link>
        </section>
      </div>
    </div>
  );
}
