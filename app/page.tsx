import { HeroComponent } from "@/components/organisms/hero-component";
import { Navbar } from "@/components/organisms/navbar";

export default function Home() {
  return (
    <div>
      <Navbar />
      <div className="relative w-full min-h-screen">
        <HeroComponent />
        <div
          className="-z-20 absolute inset-0"
          style={{
            backgroundImage: `
          linear-gradient(to right, #d1d5db 1px, transparent 1px),
        linear-gradient(to bottom, #d1d5db 1px, transparent 1px)
        `,
            backgroundSize: "32px 32px",
            WebkitMaskImage:
              "radial-gradient(ellipse 60% 60% at 50% 50%, #000 30%, transparent 70%)",
            maskImage:
              "radial-gradient(ellipse 60% 60% at 50% 50%, #000 30%, transparent 70%)",
          }}
        />
      </div>
    </div>
  );
}
