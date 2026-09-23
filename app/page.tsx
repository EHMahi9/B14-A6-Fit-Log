"use client";

import React, { useEffect, useState, useMemo } from "react";
import Hero from "@/components/Hero";
import WorkoutCard from "@/components/WorkoutCard";
import WorkoutCardSkeleton from "@/components/WorkoutCardSkeleton";
import { Workout } from "@/types/workout";
import { Search, Dumbbell, AlertTriangle, RefreshCw } from "lucide-react";

export default function HomePage() {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMuscle, setSelectedMuscle] = useState<string>("All");

  const loadWorkouts = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("https://api.abcz.workers.dev/api/fitlog");
      if (!res.ok) {
        throw new Error(`Failed to fetch workouts: ${res.statusText}`);
      }
      const data: Workout[] = await res.json();
      setWorkouts(data);
    } catch (err: unknown) {
      console.error("Error fetching workouts:", err);
      setError(
        err instanceof Error ? err.message : "Failed to load workout library"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let ignore = false;
    async function fetchInitial() {
      try {
        const res = await fetch("https://api.abcz.workers.dev/api/fitlog");
        if (!res.ok) {
          throw new Error(`Failed to fetch workouts: ${res.statusText}`);
        }
        const data: Workout[] = await res.json();
        if (!ignore) {
          setWorkouts(data);
          setLoading(false);
        }
      } catch (err: unknown) {
        if (!ignore) {
          setError(
            err instanceof Error ? err.message : "Failed to load workout library"
          );
          setLoading(false);
        }
      }
    }
    fetchInitial();
    return () => {
      ignore = true;
    };
  }, []);

  // Extract all unique muscle groups
  const allMuscleGroups = useMemo(() => {
    const set = new Set<string>();
    workouts.forEach((w) => {
      w.muscleGroups.forEach((m) => set.add(m));
    });
    return ["All", ...Array.from(set)];
  }, [workouts]);

  // Filtered workouts
  const filteredWorkouts = useMemo(() => {
    return workouts.filter((w) => {
      const matchesSearch =
        w.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        w.equipment.toLowerCase().includes(searchQuery.toLowerCase()) ||
        w.muscleGroups.some((m) =>
          m.toLowerCase().includes(searchQuery.toLowerCase())
        );

      const matchesMuscle =
        selectedMuscle === "All" || w.muscleGroups.includes(selectedMuscle);

      return matchesSearch && matchesMuscle;
    });
  }, [workouts, searchQuery, selectedMuscle]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12 sm:space-y-16">
      {/* Hero Section */}
      <Hero />

      {/* The Library Section */}
      <section id="library" className="scroll-mt-24 space-y-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#1c1f26] pb-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-[#c2f800]" />
              <span className="text-xs font-bold text-[#c2f800] uppercase tracking-widest">
                CURATED MOVEMENTS
              </span>
            </div>
            <h2 className="font-[family-name:var(--font-oswald)] font-extrabold text-3xl sm:text-4xl text-white uppercase tracking-tight">
              THE LIBRARY
            </h2>
            <p className="text-gray-400 text-sm sm:text-base mt-1">
              Twelve lifts covering every major muscle group.
            </p>
          </div>

          {/* Search and Filter Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
            {/* Search Input */}
            <div className="relative min-w-[240px]">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                placeholder="Search lifts, muscle, gear..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#15171d] border border-[#222630] text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-[#c2f800] focus:ring-1 focus:ring-[#c2f800] transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-500 hover:text-white"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Muscle Filter Pill Selector */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
              {allMuscleGroups.map((muscle) => (
                <button
                  key={muscle}
                  onClick={() => setSelectedMuscle(muscle)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                    selectedMuscle === muscle
                      ? "bg-[#c2f800] text-[#0f1115] shadow-sm shadow-[#c2f800]/20"
                      : "bg-[#15171d] text-gray-400 hover:text-white border border-[#222630]"
                  }`}
                >
                  {muscle}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {Array.from({ length: 12 }).map((_, i) => (
              <WorkoutCardSkeleton key={i} />
            ))}
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="p-8 sm:p-12 rounded-2xl bg-[#15171d] border border-red-500/20 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-red-500/10 text-red-400 mx-auto flex items-center justify-center">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white uppercase">
              Failed to load workouts
            </h3>
            <p className="text-sm text-gray-400 max-w-md mx-auto">{error}</p>
            <button
              onClick={loadWorkouts}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#c2f800] text-[#0f1115] font-bold text-sm uppercase transition-all hover:bg-[#d5ff24]"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Retry</span>
            </button>
          </div>
        )}

        {/* Workouts 3x4 Grid */}
        {!loading && !error && filteredWorkouts.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredWorkouts.map((workout) => (
              <WorkoutCard key={workout.id} workout={workout} />
            ))}
          </div>
        )}

        {/* Empty Search Result */}
        {!loading && !error && filteredWorkouts.length === 0 && (
          <div className="p-12 rounded-2xl bg-[#15171d] border border-[#222630] text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-[#20242e] text-gray-400 mx-auto flex items-center justify-center">
              <Dumbbell className="w-6 h-6" />
            </div>
            <h3 className="font-[family-name:var(--font-oswald)] font-bold text-xl text-white uppercase">
              No matching lifts found
            </h3>
            <p className="text-sm text-gray-400 max-w-md mx-auto">
              No workouts match &ldquo;{searchQuery}&rdquo;. Try another search term
              or clear your muscle filter.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedMuscle("All");
              }}
              className="px-4 py-2 rounded-xl bg-[#1f242d] border border-[#2b303d] text-xs font-semibold text-gray-300 hover:text-white"
            >
              Reset Filters
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
