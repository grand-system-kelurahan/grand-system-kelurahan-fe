import { GalleryVerticalEnd } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { SignupForm } from "@/components/signup-form";

export default function SignupPage() {
  return (
    <div className="grid lg:grid-cols-2 max-h-screen">
      <div className="flex flex-col gap-4 p-6 md:py-10">
        <div className="flex justify-center md:justify-start gap-2">
          <Link href="/" className="flex items-center gap-2 font-medium">
            <div className="flex justify-center items-center bg-primary rounded-md size-6 text-primary-foreground">
              <GalleryVerticalEnd className="size-4" />
            </div>
            Signal
          </Link>
        </div>
        <div className="flex flex-1 justify-center items-center">
          <div className="w-full max-w-xs">
            <SignupForm />
          </div>
        </div>
      </div>
      <div className="hidden lg:block max-h-screen">
        <Image
          src="/images/background.png"
          alt="Image"
          width={500}
          height={500}
          className="w-full"
        />
      </div>
    </div>
  );
}
