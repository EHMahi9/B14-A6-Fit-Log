"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { usePlan } from "@/context/PlanContext";
import { Menu, X, Dumbbell } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const { totalExercises, saved, activeTab, setActiveTab } = usePlan();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isWorkoutActive = pathname === "/" || pathname.startsWith("/workout");
  const isPlanActive = pathname.startsWith("/my-plan");

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#1c1f26] bg-[#0c0d10]/95 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
        {/* Left: Brand Logo */}
        <Link
          href="/"
          className="flex items-center gap-2.5 group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c2f800] rounded-lg p-1"
        >
          <div className="relative w-8 h-8 flex items-center justify-center">
            <Image
              src="/assets/logo.png"
              alt="FitLog Logo"
              width={28}
              height={28}
              className="object-contain filter drop-shadow-[0_0_8px_rgba(194,248,0,0.5)] transition-transform duration-300 group-hover:scale-110"
              priority
            />
          </div>
          <span className="font-extrabold text-xl sm:text-2xl tracking-wider text-white uppercase font-[family-name:var(--font-oswald)]">
            FIT<span className="text-[#c2f800]">LOG</span>
          </span>
        </Link>

        {/* Center: Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1.5 p-1 rounded-full bg-[#15171d] border border-[#222630]">
          <Link
            href="/"
            className={`px-5 py-1.5 rounded-full text-sm font-semibold transition-all duration-200 ${
              isWorkoutActive
                ? "bg-[#1a2312] text-[#c2f800] border border-[#2d3a20] shadow-sm shadow-[#c2f800]/10"
                : "text-gray-400 hover:text-white hover:bg-white/5"
            }`}
          >
            Workout
          </Link>
          <Link
            href="/my-plan"
            className={`px-5 py-1.5 rounded-full text-sm font-semibold transition-all duration-200 ${
              isPlanActive
                ? "bg-[#1a2312] text-[#c2f800] border border-[#2d3a20] shadow-sm shadow-[#c2f800]/10"
                : "text-gray-400 hover:text-white hover:bg-white/5"
            }`}
          >
            My Plan
          </Link>
        </nav>

        {/* Right: Status Badges (Counters) - Green highlight shifts between Plan and Saved */}
        <div className="hidden sm:flex items-center gap-3">
          {/* Plan badge */}
          <Link
            href="/my-plan?tab=plan"
            onClick={() => setActiveTab("plan")}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all duration-200 ${
              activeTab === "plan"
                ? "bg-[#c2f800] text-[#0f1115] shadow-sm shadow-[#c2f800]/25 hover:brightness-110"
                : "border border-[#2d313b] bg-[#15171d]/60 text-gray-200 hover:border-gray-500 hover:text-white"
            }`}
            title="View Today's Plan"
          >
            <span
              className={`tracking-wide uppercase font-semibold ${
                activeTab === "plan" ? "text-[#0f1115]" : "text-gray-300"
              }`}
            >
              Plan
            </span>
            <span
              className={`inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full text-xs font-extrabold ${
                activeTab === "plan"
                  ? "bg-[#0f1115] text-[#c2f800]"
                  : "bg-[#20242e] text-white border border-[#2d313b]"
              }`}
            >
              {totalExercises}
            </span>
          </Link>

          {/* Saved badge */}
          <Link
            href="/my-plan?tab=saved"
            onClick={() => setActiveTab("saved")}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all duration-200 ${
              activeTab === "saved"
                ? "bg-[#c2f800] text-[#0f1115] shadow-sm shadow-[#c2f800]/25 hover:brightness-110"
                : "border border-[#2d313b] bg-[#15171d]/60 text-gray-200 hover:border-gray-500 hover:text-white"
            }`}
            title="View Saved Workouts"
          >
            <span
              className={`tracking-wide uppercase font-semibold ${
                activeTab === "saved" ? "text-[#0f1115]" : "text-gray-300"
              }`}
            >
              Saved
            </span>
            <span
              className={`inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full text-xs font-extrabold ${
                activeTab === "saved"
                  ? "bg-[#0f1115] text-[#c2f800]"
                  : "bg-[#20242e] text-white border border-[#2d313b]"
              }`}
            >
              {saved.length}
            </span>
          </Link>
        </div>

        {/* Mobile Hamburger Toggle */}
        <div className="flex sm:hidden items-center gap-2">
          <Link
            href="/my-plan?tab=plan"
            onClick={() => setActiveTab("plan")}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold transition-all ${
              activeTab === "plan"
                ? "bg-[#c2f800] text-[#0f1115]"
                : "border border-[#2d313b] text-gray-300"
            }`}
          >
            <span>Plan</span>
            <span
              className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                activeTab === "plan"
                  ? "bg-[#0f1115] text-[#c2f800]"
                  : "bg-[#20242e] text-white"
              }`}
            >
              {totalExercises}
            </span>
          </Link>

          <Link
            href="/my-plan?tab=saved"
            onClick={() => setActiveTab("saved")}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold transition-all ${
              activeTab === "saved"
                ? "bg-[#c2f800] text-[#0f1115]"
                : "border border-[#2d313b] text-gray-300"
            }`}
          >
            <span>Saved</span>
            <span
              className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                activeTab === "saved"
                  ? "bg-[#0f1115] text-[#c2f800]"
                  : "bg-[#20242e] text-white"
              }`}
            >
              {saved.length}
            </span>
          </Link>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-[#15171d] border border-transparent hover:border-[#222630] transition-colors"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-t border-[#1c1f26] bg-[#0c0d10] px-4 pt-3 pb-5 space-y-3 animate-in fade-in slide-in-from-top-2">
          <nav className="flex flex-col gap-2">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className={`px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-between ${
                isWorkoutActive
                  ? "bg-[#1a2312] text-[#c2f800] border border-[#2d3a20]"
                  : "text-gray-300 hover:bg-[#15171d]"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Dumbbell className="w-4 h-4" />
                <span>Workout Library</span>
              </div>
            </Link>

            <Link
              href="/my-plan?tab=plan"
              onClick={() => setMobileMenuOpen(false)}
              className="px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-between text-gray-300 hover:bg-[#15171d]"
            >
              <span>Today&apos;s Plan</span>
              <span className="px-2 py-0.5 rounded-full bg-[#c2f800] text-[#0f1115] text-xs font-bold">
                {totalExercises}
              </span>
            </Link>

            <Link
              href="/my-plan?tab=saved"
              onClick={() => setMobileMenuOpen(false)}
              className="px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-between text-gray-300 hover:bg-[#15171d]"
            >
              <span>Saved Workouts</span>
              <span className="px-2 py-0.5 rounded-full border border-[#2d313b] text-xs text-gray-300">
                {saved.length}
              </span>
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
