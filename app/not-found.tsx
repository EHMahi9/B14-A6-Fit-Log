import React from "react";
import Link from "next/link";
import { Dumbbell, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full text-center space-y-6 p-8 sm:p-12 rounded-3xl bg-[#15171d] border border-[#222630] shadow-2xl">
        <div className="w-20 h-20 rounded-full bg-[#1a2312] border border-[#2d3a20] text-[#c2f800] mx-auto flex items-center justify-center">
          <Dumbbell className="w-10 h-10 animate-bounce" />
        </div>

        <div className="space-y-2">
          <span className="font-[family-name:var(--font-oswald)] font-extrabold text-6xl sm:text-7xl text-transparent bg-clip-text bg-gradient-to-r from-[#c2f800] via-white to-gray-400">
            404
          </span>
          <h1 className="font-[family-name:var(--font-oswald)] font-extrabold text-2xl sm:text-3xl text-white uppercase tracking-tight">
            PAGE NOT FOUND
          </h1>
          <p className="text-gray-400 text-sm leading-relaxed">
            The lift or route you are looking for does not exist in the log.
            Head back to the library to stay on plan.
          </p>
        </div>

        <div className="pt-2">
          <Link
            href="/"
            className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-[#c2f800] text-[#0f1115] font-extrabold text-sm uppercase tracking-wider transition-all duration-300 hover:bg-[#d5ff24] hover:shadow-[0_0_20px_rgba(194,248,0,0.4)] hover:-translate-y-0.5 active:translate-y-0"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Workouts</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
