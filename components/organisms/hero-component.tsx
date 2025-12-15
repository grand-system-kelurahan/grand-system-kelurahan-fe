import { Star } from "lucide-react";
import Link from "next/link";

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

interface Hero7Props {
  heading?: string;
  description?: string;
  button?: {
    text: string;
    url: string;
  };
  reviews?: {
    count: number;
    rating?: number;
    avatars: {
      src: string;
      alt: string;
    }[];
  };
}

export const HeroComponent = ({
  heading = "Grand System Kelurahan",
  description = "Sistem Informasi Kelurahan yang menyediakan berbagai macam modul untuk memudahkan pengelolaan kelurahan.",
  button = {
    text: "Discover all components",
    url: "https://www.shadcnblocks.com",
  },
  reviews = {
    count: 200,
    rating: 5.0,
    avatars: [
      {
        src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/avatar-1.webp",
        alt: "Deo",
      },
      {
        src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/avatar-2.webp",
        alt: "Arya",
      },
      {
        src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/avatar-4.webp",
        alt: "Adit",
      },
      {
        src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/avatar-5.webp",
        alt: "Eka",
      },
      {
        src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/avatar-2.webp",
        alt: "Sandy",
      },
    ],
  },
}: Hero7Props) => {
  return (
    <section className="py-32">
      <div className="text-center container">
        <div className="flex flex-col gap-6 mx-auto max-w-5xl">
          <h1 className="font-semibold text-3xl lg:text-6xl">{heading}</h1>
          <p className="text-muted-foreground lg:text-lg text-balance">
            {description}
          </p>
        </div>
        <div className="flex justify-center items-center gap-2 mt-10 w-full">
          <Link href={"/login"}>
            <Button size="lg">Login</Button>
          </Link>
          <Link href={"/signup"}>
            <Button size="lg" variant={"outline"}>
              Daftar
            </Button>
          </Link>
        </div>
        <div className="flex sm:flex-row flex-col items-center gap-4 mx-auto mt-10 w-fit">
          <span className="inline-flex items-center -space-x-4 mx-4">
            {reviews.avatars.map((avatar, index) => (
              <Tooltip key={index}>
                <TooltipTrigger asChild>
                  <Avatar key={index} className="border size-14">
                    <AvatarImage src={avatar.src} alt={avatar.alt} />
                  </Avatar>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{avatar.alt}</p>
                </TooltipContent>
              </Tooltip>
            ))}
          </span>
        </div>
      </div>
    </section>
  );
};
