import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpenText, NotebookPen, PenSquare } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function NewsDashboard() {
  const newsOptions = [
    {
      title: "All News",
      icon: (
        <Image
          width={50}
          height={50}
          className="w-7 h-7"
          src={"/assets/images/news/all_news.svg"}
          alt="all_news"
        />
      ),
      href: "/dashboard/news/all-news",
      description: "View and manage all news articles",
      button: "View",
    },
    {
      title: "Add News",
      icon: (
        <Image
          width={50}
          height={50}
          className="w-7 h-7"
          src={"/assets/images/news/add_news.svg"}
          alt="add_news"
        />
      ),
      href: "/dashboard/news/create-news",
      description: "Create a new news article",
      button: "Add News",
    },
  ];

  return (
    <div className="container mx-auto md:py-8">
      <h1 className="text-2xl font-semibold text-[#18181B] text-center pb-4 md:mb-8">
        News Options
      </h1>
      <div className="w-full flex flex-col md:flex-row justify-center items-center gap-5">
        {newsOptions.map((option) => (
          <Link
            href={option.href}
            key={option.title}
            className="h-[190px] 2xl:h-[200px] w-full md:w-[50%] lg:w-[32%]"
          >
            <Card className="shadow-sm h-full w-full  hover:shadow-md bg-white border border-[#EEEEEE] rounded-lg  transition-shadow cursor-pointer ">
              <CardContent className="w-full h-full text-center flex flex-col justify-center items-center gap-y-4">
                <div className=" w-12 h-12  bg-white border border-[#eeeeee] rounded-md flex items-center justify-center p-1">
                  {option.icon}
                </div>
                <div>
                  <h2 className="text-lg text-[#101828] font-semibold ">
                    {option.title}
                  </h2>
                  <p className="text-[#696969] text-base">
                    {option.description}
                  </p>
                </div>

                <Button className="bg-blue-600 text-base w-[50%] hover:bg-blue-700">
                  <Link href={option.href} key={option.title}>
                    {option?.button}
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
