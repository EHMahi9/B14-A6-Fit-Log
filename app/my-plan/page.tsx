"use client";

import React, { useState, useEffect, useMemo, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import { usePlan } from "@/context/PlanContext";
import { SortOption, SortDirection, PlannedWorkout, Workout } from "@/types/workout";
import {
  Clock,
  Flame,
  Star,
  Check,
  X,
  Eye,
  ChevronDown,
  Dumbbell,
  ArrowRight,
  CheckCircle2,
  CalendarCheck,
  Plus,
  Bookmark,
  ArrowDownNarrowWide,
  ArrowUpNarrowWide,
} from "lucide-react";

function PlanContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");

  const {
    plan,
    saved,
    isLoaded,
    activeTab,
    setActiveTab,
    markAsDone,
    removeFromPlan,
    removeFromSaved,
    addToPlan,
  } = usePlan();

  const [sortBy, setSortBy] = useState<SortOption>("Duration");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);

  // Sync activeTab with URL tabParam if present
  useEffect(() => {
    if (tabParam === "saved") {
      setActiveTab("saved");
    } else if (tabParam === "plan") {
      setActiveTab("plan");
    }
  }, [tabParam, setActiveTab]);

  const handleTabChange = (newTab: "plan" | "saved") => {
    setActiveTab(newTab);
    router.replace(`/my-plan?tab=${newTab}`, { scroll: false });
  };

  // Metrics calculation for the active view
  const currentItems = activeTab === "plan" ? plan : saved;
  const currentCount = currentItems.length;
  const currentMinutes = currentItems.reduce(
    (sum, item) => sum + (item.duration || 0),
    0
  );
  const currentCalories = currentItems.reduce(
    (sum, item) => sum + (item.caloriesBurned || 0),
    0
  );

  // Sorting logic (Challenge C1: Duration, Calories, Rating with Ascending / Descending order)
  const sortedItems = useMemo(() => {
    const list = activeTab === "plan" ? [...plan] : [...saved];

    return list.sort((a, b) => {
      const durA = a.duration || 0;
      const durB = b.duration || 0;
      const calA = a.caloriesBurned || 0;
      const calB = b.caloriesBurned || 0;
      const ratA = a.rating || 0;
      const ratB = b.rating || 0;

      let comparison = 0;
      if (sortBy === "Duration") {
        comparison = durB - durA; // Descending base
      } else if (sortBy === "Calories") {
        comparison = calB - calA; // Descending base
      } else if (sortBy === "Rating") {
        comparison = ratB - ratA; // Descending base
      }

      return sortDirection === "asc" ? -comparison : comparison;
    });
  }, [activeTab, plan, saved, sortBy, sortDirection]);

  if (!isLoaded) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center space-y-4">
        <div className="w-10 h-10 border-2 border-[#c2f800] border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-gray-400 text-sm font-medium tracking-wide">
          Loading workouts…
        </p>
      </div>
    );
  }

  const isEmpty = sortedItems.length === 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 sm:space-y-10">
      {/* Title & Subtitle */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#c2f800]" />
          <span className="text-xs font-bold text-[#c2f800] uppercase tracking-widest">
            DAILY WORKOUT LOG
          </span>
        </div>
        <h1 className="font-[family-name:var(--font-oswald)] font-extrabold text-3xl sm:text-4xl lg:text-5xl text-white uppercase tracking-tight">
          MY PLAN
        </h1>
        <p className="text-gray-400 text-sm sm:text-base">
          Cap of five lifts for today. Finish them, then load more.
        </p>
      </div>

      {/* Metrics Summary Row matching Figma */}
      <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-[#232732] rounded-2xl bg-[#13161d] border border-[#232732] shadow-xl overflow-hidden">
        {/* Exercises */}
        <div className="p-6 sm:p-7 flex flex-col justify-center">
          <span className="font-[family-name:var(--font-oswald)] font-extrabold text-3xl sm:text-4xl text-white">
            {currentCount}
          </span>
          <span className="text-xs sm:text-sm font-semibold text-gray-400 mt-1">
            Exercises {activeTab === "saved" ? "(Saved)" : "(Today's Plan)"}
          </span>
        </div>

        {/* Minutes */}
        <div className="p-6 sm:p-7 flex flex-col justify-center">
          <span className="font-[family-name:var(--font-oswald)] font-extrabold text-3xl sm:text-4xl text-white">
            {currentMinutes}
          </span>
          <span className="text-xs sm:text-sm font-semibold text-gray-400 mt-1">
            Minutes
          </span>
        </div>

        {/* Calories */}
        <div className="p-6 sm:p-7 flex flex-col justify-center">
          <span className="font-[family-name:var(--font-oswald)] font-extrabold text-3xl sm:text-4xl text-white">
            {currentCalories}
          </span>
          <span className="text-xs sm:text-sm font-semibold text-gray-400 mt-1">
            Calories
          </span>
        </div>
      </div>

      {/* Tabs & Sort Controls Row */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 border-b border-[#1c1f26] pb-4">
        {/* Tabs: Today's Plan / Saved */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#151921] border border-[#232732] self-start">
          <button
            onClick={() => handleTabChange("plan")}
            className={`flex items-center gap-2 px-4 sm:px-5 py-2 rounded-lg text-xs sm:text-sm font-bold uppercase tracking-wider transition-all duration-200 active:scale-[0.98] ${
              activeTab === "plan"
                ? "bg-[#1a2312] text-[#c2f800] border border-[#2d3a20] shadow-sm shadow-[#c2f800]/15"
                : "text-gray-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <CalendarCheck className="w-4 h-4 text-[#c2f800]" />
            <span>Today&apos;s Plan</span>
            <span
              className={`px-1.5 py-0.5 rounded-full text-[11px] font-extrabold ${
                activeTab === "plan"
                  ? "bg-[#c2f800] text-[#0f1115]"
                  : "bg-[#20242e] text-gray-300"
              }`}
            >
              {plan.length}
            </span>
          </button>

          <button
            onClick={() => handleTabChange("saved")}
            className={`flex items-center gap-2 px-4 sm:px-5 py-2 rounded-lg text-xs sm:text-sm font-bold uppercase tracking-wider transition-all duration-200 active:scale-[0.98] ${
              activeTab === "saved"
                ? "bg-[#1a2312] text-[#c2f800] border border-[#2d3a20] shadow-sm shadow-[#c2f800]/15"
                : "text-gray-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <Bookmark className="w-4 h-4 text-[#c2f800]" />
            <span>Saved</span>
            <span
              className={`px-1.5 py-0.5 rounded-full text-[11px] font-extrabold ${
                activeTab === "saved"
                  ? "bg-[#c2f800] text-[#0f1115]"
                  : "bg-[#20242e] text-gray-300"
              }`}
            >
              {saved.length}
            </span>
          </button>
        </div>

        {/* Challenge C1: Sort By Criteria & Order Toggle (Ascending & Descending) */}
        <div className="relative flex items-center gap-2 self-end sm:self-auto flex-wrap">
          <span className="text-xs uppercase font-bold tracking-wider text-gray-400 whitespace-nowrap">
            Sort By
          </span>

          {/* Criteria Dropdown */}
          <div className="relative">
            <button
              onClick={() => setSortDropdownOpen(!sortDropdownOpen)}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#13161d] border border-[#232732] text-xs font-semibold text-gray-200 hover:border-gray-500 transition-colors focus:outline-none focus:ring-1 focus:ring-[#c2f800]"
              aria-label="Select sort criteria"
            >
              <span>{sortBy}</span>
              <ChevronDown
                className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-200 ${
                  sortDropdownOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {sortDropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-20"
                  onClick={() => setSortDropdownOpen(false)}
                />
                <div className="absolute right-0 mt-1.5 w-52 rounded-xl bg-[#151921] border border-[#232732] shadow-2xl py-1.5 z-30 animate-in fade-in">
                  <div className="px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-gray-400">
                    Sort Criteria
                  </div>
                  {(["Duration", "Calories", "Rating"] as SortOption[]).map(
                    (option) => (
                      <button
                        key={option}
                        onClick={() => {
                          setSortBy(option);
                          setSortDropdownOpen(false);
                        }}
                        className={`w-full text-left px-3.5 py-2 text-xs font-semibold flex items-center justify-between transition-colors ${
                          sortBy === option
                            ? "bg-[#1a2312] text-[#c2f800]"
                            : "text-gray-300 hover:bg-[#1f242d] hover:text-white"
                        }`}
                      >
                        <span>{option}</span>
                        {sortBy === option && (
                          <Check className="w-3.5 h-3.5 text-[#c2f800]" />
                        )}
                      </button>
                    )
                  )}

                  <div className="my-1.5 border-t border-[#232732]" />

                  <div className="px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-gray-400">
                    Order
                  </div>
                  <button
                    onClick={() => {
                      setSortDirection("desc");
                      setSortDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3.5 py-2 text-xs font-semibold flex items-center justify-between transition-colors ${
                      sortDirection === "desc"
                        ? "bg-[#1a2312] text-[#c2f800]"
                        : "text-gray-300 hover:bg-[#1f242d] hover:text-white"
                    }`}
                  >
                    <span className="flex items-center gap-1.5">
                      <ArrowDownNarrowWide className="w-3.5 h-3.5 text-[#c2f800]" />
                      Descending (High → Low)
                    </span>
                    {sortDirection === "desc" && (
                      <Check className="w-3.5 h-3.5 text-[#c2f800]" />
                    )}
                  </button>
                  <button
                    onClick={() => {
                      setSortDirection("asc");
                      setSortDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3.5 py-2 text-xs font-semibold flex items-center justify-between transition-colors ${
                      sortDirection === "asc"
                        ? "bg-[#1a2312] text-[#c2f800]"
                        : "text-gray-300 hover:bg-[#1f242d] hover:text-white"
                    }`}
                  >
                    <span className="flex items-center gap-1.5">
                      <ArrowUpNarrowWide className="w-3.5 h-3.5 text-[#c2f800]" />
                      Ascending (Low → High)
                    </span>
                    {sortDirection === "asc" && (
                      <Check className="w-3.5 h-3.5 text-[#c2f800]" />
                    )}
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Quick Toggle Button for Ascending / Descending Order */}
          <button
            onClick={() =>
              setSortDirection((prev) => (prev === "desc" ? "asc" : "desc"))
            }
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#13161d] border border-[#232732] text-xs font-semibold text-gray-200 hover:border-[#c2f800]/50 hover:text-white transition-all focus:outline-none focus:ring-1 focus:ring-[#c2f800] active:scale-95"
            title={
              sortDirection === "desc"
                ? "Descending: High to Low (Click for Ascending: Low to High)"
                : "Ascending: Low to High (Click for Descending: High to Low)"
            }
            aria-label="Toggle ascending and descending order"
          >
            {sortDirection === "desc" ? (
              <>
                <ArrowDownNarrowWide className="w-3.5 h-3.5 text-[#c2f800]" />
                <span className="hidden sm:inline">High → Low</span>
                <span className="sm:hidden">Desc</span>
              </>
            ) : (
              <>
                <ArrowUpNarrowWide className="w-3.5 h-3.5 text-[#c2f800]" />
                <span className="hidden sm:inline">Low → High</span>
                <span className="sm:hidden">Asc</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Empty State (when active tab list is empty) */}
      {isEmpty ? (
        <div className="p-12 sm:p-16 rounded-3xl bg-[#111317] border border-[#232732] text-center space-y-5">
          <div className="w-16 h-16 rounded-full bg-[#15171d] border border-[#222630] text-gray-400 mx-auto flex items-center justify-center">
            {activeTab === "saved" ? (
              <Bookmark className="w-8 h-8 text-[#c2f800]" />
            ) : (
              <Dumbbell className="w-8 h-8 text-[#c2f800]" />
            )}
          </div>

          <div className="space-y-1.5">
            <h2 className="font-[family-name:var(--font-oswald)] font-extrabold text-2xl sm:text-3xl text-white uppercase tracking-tight">
              {activeTab === "saved" ? "NO SAVED WORKOUTS YET" : "NOTHING HERE YET"}
            </h2>
            <p className="text-gray-400 text-sm sm:text-base max-w-md mx-auto">
              {activeTab === "plan"
                ? "Browse the library and add a lift to get today moving."
                : "Save your favorite lifts from the library to quickly find them here later."}
            </p>
          </div>

          <div className="pt-2">
            <Link
              href="/#library"
              className="inline-flex items-center gap-2.5 px-6 sm:px-7 py-3.5 rounded-xl bg-[#c2f800] text-[#0f1115] font-extrabold text-sm sm:text-base uppercase tracking-wider transition-all duration-300 hover:bg-[#d5ff24] hover:shadow-[0_0_20px_rgba(194,248,0,0.4)] hover:-translate-y-0.5 active:translate-y-0"
            >
              <span>Go to workouts</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      ) : (
        /* Workout Cards List */
        <div className="space-y-4">
          {sortedItems.map((item) => {
            const plannedItem = activeTab === "plan" ? (item as PlannedWorkout) : null;
            const isDone = plannedItem?.completed ?? false;

            return (
              <div
                key={item.id}
                className={`flex flex-col md:flex-row items-stretch md:items-center justify-between gap-5 p-4 sm:p-5 rounded-2xl border transition-all duration-300 ${
                  isDone
                    ? "bg-[#14171e]/70 border-[#2d3a20] shadow-sm shadow-[#c2f800]/5"
                    : "bg-[#14171e] border-[#232732] hover:border-[#2f3544]"
                }`}
              >
                {/* Left Side: Thumbnail & Exercise Details */}
                <div className="flex items-center gap-4 sm:gap-6 flex-1 min-w-0">
                  {/* Thumbnail Image */}
                  <div className="relative w-24 sm:w-32 aspect-[4/3] rounded-xl overflow-hidden bg-[#1f242d] shrink-0 border border-[#232732]">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      sizes="(max-width: 640px) 96px, 128px"
                      className="object-cover object-center"
                    />
                    {isDone && (
                      <div className="absolute inset-0 bg-black/60 backdrop-blur-[1px] flex items-center justify-center">
                        <CheckCircle2 className="w-7 h-7 text-[#c2f800]" />
                      </div>
                    )}
                  </div>

                  {/* Information & Stats */}
                  <div className="space-y-2 min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3
                        className={`font-[family-name:var(--font-oswald)] font-bold text-lg sm:text-xl uppercase tracking-tight truncate ${
                          isDone ? "text-gray-400 line-through" : "text-white"
                        }`}
                      >
                        {item.name}
                      </h3>
                      {isDone && (
                        <span className="px-2 py-0.5 rounded-full bg-[#1a2312] border border-[#2d3a20] text-[#c2f800] text-[10px] font-extrabold uppercase tracking-wider">
                          Done
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-gray-400 font-medium">
                      {item.equipment}
                    </p>

                    {/* Stats Row with #ccff00 icons */}
                    <div className="flex items-center gap-4 text-xs font-semibold text-gray-300 flex-wrap">
                      <div className="flex items-center gap-1.5" title="Duration">
                        <Clock className="w-3.5 h-3.5 text-[#ccff00]" />
                        <span>{item.duration} min</span>
                      </div>

                      <div className="flex items-center gap-1.5" title="Calories">
                        <Flame className="w-3.5 h-3.5 text-[#ccff00] fill-[#ccff00]" />
                        <span>{item.caloriesBurned} kcal</span>
                      </div>

                      <div className="flex items-center gap-1.5" title="Rating">
                        <Star className="w-3.5 h-3.5 text-[#ccff00] fill-[#ccff00]" />
                        <span>{item.rating}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Side: Action Buttons */}
                <div className="flex items-center justify-end gap-2.5 pt-3 md:pt-0 border-t md:border-t-0 border-[#20242e] shrink-0">
                  {/* View Details button (Left side) */}
                  <Link
                    href={`/workout/${item.id}`}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#151921] border border-[#374151] text-xs font-bold text-gray-200 uppercase tracking-wider hover:text-white hover:border-gray-400 transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5 text-gray-400" />
                    <span>View Details</span>
                  </Link>

                  {/* Mark as Done button (Right side, Challenge C3 - for plan items) */}
                  {activeTab === "plan" && (
                    <button
                      onClick={() => markAsDone(item.id)}
                      className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                        isDone
                          ? "bg-[#1a2312] text-[#c2f800] border border-[#2d3a20] hover:bg-[#202d15]"
                          : "bg-[#c2f800] text-[#0f1115] hover:bg-[#d5ff24] hover:shadow-[0_0_12px_rgba(194,248,0,0.3)]"
                      }`}
                      title={isDone ? "Mark as Incomplete" : "Mark as Done"}
                    >
                      <Check className="w-4 h-4" />
                      <span>{isDone ? "Completed" : "Mark as Done"}</span>
                    </button>
                  )}

                  {/* Add to plan button (if viewing saved list) */}
                  {activeTab === "saved" && (
                    <button
                      onClick={() => addToPlan(item as Workout)}
                      className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#c2f800] text-[#0f1115] text-xs font-bold uppercase tracking-wider hover:bg-[#d5ff24] transition-all"
                      title="Add to today's plan"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add to Plan</span>
                    </button>
                  )}

                  {/* Remove (X) button (Challenge C3) */}
                  <button
                    onClick={() => {
                      if (activeTab === "plan") {
                        removeFromPlan(item.id);
                      } else {
                        removeFromSaved(item.id);
                      }
                    }}
                    className="p-2 rounded-xl text-gray-400 hover:text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-colors"
                    title="Remove lift"
                    aria-label={`Remove ${item.name}`}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function MyPlanPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center space-y-4">
          <div className="w-10 h-10 border-2 border-[#c2f800] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-gray-400 text-sm font-medium tracking-wide">
            Loading workouts…
          </p>
        </div>
      }
    >
      <PlanContent />
    </Suspense>
  );
}
