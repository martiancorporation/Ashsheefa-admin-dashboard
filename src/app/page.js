"use client";
import Image from "next/image";
import LoginForm from "./components/LoginForm";
import Link from "next/link";

export default function Home() {
  return (
    <>
      {
        <main className="w-full  h-screen p-3">
          <div className="w-full h-full grid grid-cols-1 lg:grid-cols-2 gap-6 bg-[#ffffff] border border-[#DCDCDC] rounded-[10px] overflow-hidden p-2.5">
            <div className=" w-full  bg-[#005CD4] rounded-[6px]   relative hidden  lg:block p-4">
              <div className="absolute inset-0 [background-image:radial-gradient(#E9E9E9_0px,transparent_1px)] [background-size:20px_20px] z-10" />
              <div className="w-full flex flex-col items-center gap-y-3 pt-10 z-20">
                <div className="w-[130px]  flex ">
                  <Image
                    src="/assets/images/whiteLogo.svg"
                    alt="white Logo"
                    width={500}
                    height={500}
                    className="h-[35px]  xl:h-[40px] "
                  />
                  <div className="flex flex-col justify-center items-center">
                    <p className="uppercase text-[#FFFFFF] leading-3 md:leading-4 font-bold text-sm ">
                      Ashsheefa
                    </p>
                    <p className="uppercase text-[11px]  text-[#FFFFFF]">
                      Hospital
                    </p>
                  </div>
                </div>
                <p className="text-base xl:text-lg text-[#FFFFFF] ">
                  Compassionate, expert cardiac care at South 24 Parganas.
                </p>
              </div>

              <Image
                src="/assets/images/doctor.png"
                alt="doctor"
                width={500}
                height={500}
                className="w-full  xl:h-[300px] absolute bottom-0  z-20"
              />
            </div>
            <div className="w-full bg-white flex flex-col relative  ">
              <LoginForm />

              <div className="w-full absolute bottom-3  flex  gap-y-1 justify-between items-center ">
                <div className="flex text-[#005CD4] text-sm font-medium gap-x-2 ">
                  <Link href={"/terms-conditions"}>Terms & Conditions</Link>
                  <div className="w-[1px] h-[18px] bg-black"></div>
                  <Link href={"/privacy-policy"}>Privacy Policy</Link>
                </div>
                <div className="text-sm font-medium">Version 1.0.0</div>
              </div>
            </div>
          </div>
        </main>
      }
    </>
  );
}
