import React from "react";
import Image from "next/image";
import { ArrowDown } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-[#15171d] border border-[#222630] shadow-2xl shadow-black/40">
      {/* Background radial highlight */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-[#c2f800]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-[#c2f800]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center p-6 sm:p-10 lg:p-14">
        {/* Left Column: Typography & Action */}
        <div className="lg:col-span-7 flex flex-col items-start gap-5 sm:gap-6 z-10">
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#1a2312] border border-[#2d3a20]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#c2f800] animate-pulse" />
            <span className="text-[#c2f800] text-xs font-bold tracking-[0.2em] uppercase">
              WORKOUT LIBRARY
            </span>
          </div>

          {/* Main Heading */}
          <h1 className="font-[family-name:var(--font-oswald)] font-extrabold text-3xl sm:text-5xl lg:text-6xl text-white uppercase tracking-tight leading-[1.08]">
            TRAIN WITH INTENT. <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-100 to-gray-400">
              LOG EVERY SET.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-gray-400 text-sm sm:text-base lg:text-lg max-w-xl leading-relaxed font-normal">
            FitLog is a dark, no-nonsense gym companion: pick a lift, lock it into
            today&apos;s plan, and watch the week&apos;s work add up.
          </p>

          {/* Primary CTA Button (Anchor link to #library) */}
          <div className="pt-2">
            <a
              href="#library"
              className="inline-flex items-center gap-3 px-6 sm:px-7 py-3.5 rounded-xl bg-[#c2f800] text-[#0f1115] font-extrabold text-sm sm:text-base uppercase tracking-wider transition-all duration-300 hover:bg-[#d5ff24] hover:shadow-[0_0_24px_rgba(194,248,0,0.45)] hover:-translate-y-0.5 active:translate-y-0 group"
            >
              <span>BROWSE WORKOUTS</span>
              <div className="w-6 h-6 rounded-full bg-[#0f1115]/10 flex items-center justify-center transition-transform duration-300 group-hover:translate-y-0.5">
                <ArrowDown className="w-4 h-4 text-[#0f1115]" />
              </div>
            </a>
          </div>
        </div>

        {/* Right Column: Hero Visual Image matching Figma */}
        <div className="lg:col-span-5 relative w-full flex items-center justify-center py-4 lg:py-0">
          <div className="relative w-full max-w-sm lg:max-w-none h-64 sm:h-80 lg:h-96 flex items-center justify-center">
            <Image
              src="/assets/hero-machine.png"
              alt="Athlete training on workout machine"
              fill
              priority
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 40vw"
              className="object-contain object-center filter drop-shadow-[0_15px_30px_rgba(0,0,0,0.7)] transition-transform duration-500 hover:scale-105"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
