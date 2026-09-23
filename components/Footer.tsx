import React from "react";
import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="w-full border-t border-[#1a1d24] bg-[#090a0d] mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Left: Brand Logo + FITLOG */}
        <Link
          href="/"
          className="flex items-center gap-2.5 group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c2f800] rounded-lg"
        >
          <div className="relative w-6 h-6 flex items-center justify-center">
            <Image
              src="/assets/logo.png"
              alt="FitLog Logo"
              width={22}
              height={22}
              className="object-contain filter drop-shadow-[0_0_6px_rgba(194,248,0,0.4)] transition-transform duration-200 group-hover:scale-105"
            />
          </div>
          <span className="font-extrabold text-lg tracking-wider text-white uppercase font-[family-name:var(--font-oswald)]">
            FIT<span className="text-[#c2f800]">LOG</span>
          </span>
        </Link>

        {/* Right: Copyright notice */}
        <p className="text-xs sm:text-sm text-gray-400 text-center sm:text-right tracking-tight font-medium">
          © 2026 FitLog — Workout Library. Train hard, log honest.
        </p>
      </div>
    </footer>
  );
}
