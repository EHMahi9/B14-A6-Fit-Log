"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Workout } from "@/types/workout";
import { usePlan } from "@/context/PlanContext";
import {
  ArrowLeft,
  Plus,
  Bookmark,
  Check,
  Star,
  AlertCircle,
} from "lucide-react";

export default function WorkoutDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [workout, setWorkout] = useState<Workout | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { addToPlan, addToSaved, removeFromSaved, isPlanned, isSaved, plan } = usePlan();

  useEffect(() => {
    if (!id) return;
    let ignore = false;

    async function fetchDetail() {
      try {
        const res = await fetch(`https://api.abcz.workers.dev/api/fitlog/${id}`);
        if (!res.ok) {
          if (res.status === 404) {
            throw new Error("Workout lift not found");
          }
          throw new Error(`Failed to load workout details (${res.status})`);
        }
        const data: Workout = await res.json();
        if (!ignore) {
          setWorkout(data);
          setLoading(false);
        }
      } catch (err: unknown) {
        if (!ignore) {
          setError(
            err instanceof Error ? err.message : "Failed to load workout"
          );
          setLoading(false);
        }
      }
    }

    fetchDetail();
    return () => {
      ignore = true;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 animate-pulse space-y-8">
        <div className="h-6 w-32 bg-[#1f2430] rounded-md" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          <div className="lg:col-span-5 aspect-[4/5] bg-[#15171d] border border-[#222630] rounded-3xl" />
          <div className="lg:col-span-7 space-y-6">
            <div className="h-6 w-24 bg-[#1f2430] rounded-full" />
            <div className="h-10 w-3/4 bg-[#1f2430] rounded-lg" />
            <div className="h-16 w-full bg-[#15171d] rounded-xl" />
            <div className="h-44 w-full bg-[#15171d] rounded-2xl" />
            <div className="h-12 w-full bg-[#1f2430] rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !workout) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-red-500/10 text-red-400 mx-auto flex items-center justify-center">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h1 className="font-[family-name:var(--font-oswald)] font-extrabold text-3xl sm:text-4xl text-white uppercase">
          Workout Not Found
        </h1>
        <p className="text-gray-400 text-base max-w-md mx-auto">
          {error || "The exercise you are looking for does not exist in the library."}
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#c2f800] text-[#0f1115] font-bold text-sm uppercase transition-all hover:bg-[#d5ff24]"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Workouts</span>
        </Link>
      </div>
    );
  }

  const planned = isPlanned(workout.id);
  const saved = isSaved(workout.id);
  const isPlanFull = plan.length >= 5 && !planned;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-8">
      {/* Back Button */}
      <button
        onClick={() => router.push("/")}
        className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gray-400 hover:text-[#c2f800] transition-colors group focus:outline-none"
      >
        <ArrowLeft className="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-1" />
        <span>Back to Workouts</span>
      </button>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left Column: Visual Media Display */}
        <div className="lg:col-span-5 w-full sticky top-28">
          <div className="relative w-full aspect-[4/5] sm:aspect-[1/1] lg:aspect-[4/5] rounded-3xl overflow-hidden border border-[#232834] bg-[#171a21] shadow-2xl shadow-black/50">
            <Image
              src={workout.image}
              alt={workout.name}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 40vw"
              className="object-cover object-center"
            />
            {/* Subtle gradient vignette */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0c0d10]/70 via-transparent to-transparent pointer-events-none" />

            {/* Quick badges on image */}
            <div className="absolute top-4 left-4 flex flex-wrap gap-2">
              <span className="px-3 py-1 rounded-full bg-[#0c0d10]/85 backdrop-blur-md border border-[#2d313b] text-gray-200 text-xs font-bold uppercase tracking-wider">
                {workout.difficulty}
              </span>
            </div>

            <div className="absolute bottom-4 right-4 flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0c0d10]/90 backdrop-blur-md border border-[#2d313b] text-[#c2f800] text-xs font-bold">
              <Star className="w-3.5 h-3.5 fill-[#c2f800]" />
              <span>{workout.rating} Rating</span>
            </div>
          </div>
        </div>

        {/* Right Column: Exercise Information & Actions */}
        <div className="lg:col-span-7 flex flex-col gap-6 sm:gap-8">
          {/* Category Tags matching Figma */}
          <div className="flex flex-wrap items-center gap-2">
            {workout.muscleGroups.map((group) => (
              <span
                key={group}
                className="px-3.5 py-1 rounded-full bg-[#c2f800] text-[#0f1115] text-xs font-bold uppercase tracking-wider shadow-sm"
              >
                {group}
              </span>
            ))}
          </div>

          {/* Title & Description */}
          <div className="space-y-3">
            <h1 className="font-[family-name:var(--font-oswald)] font-extrabold text-3xl sm:text-4xl lg:text-5xl text-white uppercase tracking-tight leading-tight">
              {workout.name}
            </h1>
            <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
              {workout.description}
            </p>
          </div>

          {/* Key Specs Table / Panel matching Figma 7-row layout */}
          <div className="rounded-2xl bg-[#151922] border border-[#232834] divide-y divide-[#1e2330] overflow-hidden shadow-lg">
            <div className="flex items-center justify-between px-5 py-3 text-xs sm:text-sm">
              <span className="font-semibold text-gray-400 uppercase tracking-wider">
                EQUIPMENT
              </span>
              <span className="font-bold text-white text-right">
                {workout.equipment}
              </span>
            </div>

            <div className="flex items-center justify-between px-5 py-3 text-xs sm:text-sm">
              <span className="font-semibold text-gray-400 uppercase tracking-wider">
                DIFFICULTY
              </span>
              <span className="font-bold text-white text-right">
                {workout.difficulty}
              </span>
            </div>

            <div className="flex items-center justify-between px-5 py-3 text-xs sm:text-sm">
              <span className="font-semibold text-gray-400 uppercase tracking-wider">
                SETS
              </span>
              <span className="font-bold text-white text-right">
                {workout.sets}
              </span>
            </div>

            <div className="flex items-center justify-between px-5 py-3 text-xs sm:text-sm">
              <span className="font-semibold text-gray-400 uppercase tracking-wider">
                REPS
              </span>
              <span className="font-bold text-white text-right">
                {workout.reps}
              </span>
            </div>

            <div className="flex items-center justify-between px-5 py-3 text-xs sm:text-sm">
              <span className="font-semibold text-gray-400 uppercase tracking-wider">
                DURATION
              </span>
              <span className="font-bold text-white text-right">
                {workout.duration} min
              </span>
            </div>

            <div className="flex items-center justify-between px-5 py-3 text-xs sm:text-sm">
              <span className="font-semibold text-gray-400 uppercase tracking-wider">
                CALORIES
              </span>
              <span className="font-bold text-white text-right">
                {workout.caloriesBurned} kcal
              </span>
            </div>

            <div className="flex items-center justify-between px-5 py-3 text-xs sm:text-sm">
              <span className="font-semibold text-gray-400 uppercase tracking-wider">
                RATING
              </span>
              <span className="font-bold text-[#c2f800] text-right flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-[#c2f800]" />
                {workout.rating}
              </span>
            </div>
          </div>

          {/* Call to Action Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2">
            {/* Primary Button: Add to Today's Plan */}
            <button
              onClick={() => addToPlan(workout)}
              disabled={planned || isPlanFull}
              className={`flex-1 flex items-center justify-center gap-2.5 px-6 py-4 rounded-xl font-extrabold text-sm sm:text-base uppercase tracking-wider transition-all duration-200 ${
                planned
                  ? "bg-[#1a2312] text-[#c2f800] border border-[#2d3a20] cursor-default"
                  : isPlanFull
                  ? "bg-[#1f242d] text-gray-500 border border-[#2b303d] cursor-not-allowed"
                  : "bg-[#c2f800] text-[#0f1115] hover:bg-[#d5ff24] hover:shadow-[0_0_20px_rgba(194,248,0,0.4)] hover:-translate-y-0.5 active:translate-y-0"
              }`}
            >
              {planned ? (
                <>
                  <Check className="w-5 h-5 text-[#c2f800]" />
                  <span>In Today&apos;s Plan</span>
                </>
              ) : isPlanFull ? (
                <>
                  <Plus className="w-5 h-5" />
                  <span>Plan Full (5 Lifts Cap)</span>
                </>
              ) : (
                <>
                  <Plus className="w-5 h-5" />
                  <span>Add to today&apos;s plan</span>
                </>
              )}
            </button>

            {/* Secondary Button: Save for Later (Turns green when saved) */}
            <button
              onClick={() => {
                if (saved) {
                  removeFromSaved(workout.id);
                } else {
                  addToSaved(workout);
                }
              }}
              className={`flex items-center justify-center gap-2.5 px-6 py-4 rounded-xl font-bold text-sm sm:text-base uppercase tracking-wider transition-all duration-200 border cursor-pointer active:scale-[0.98] ${
                saved
                  ? "bg-[#1a2312] text-[#c2f800] border-[#2d3a20] shadow-sm shadow-[#c2f800]/20 hover:bg-[#223018] hover:border-[#384828]"
                  : "border-[#374151] bg-[#15171d] text-white hover:bg-[#1a1d24] hover:border-[#c2f800]/50 hover:text-[#c2f800] active:bg-[#c2f800] active:text-[#0f1115]"
              }`}
              title={saved ? "Saved (click to unsave)" : "Save for later"}
              aria-label={saved ? "Remove from saved" : "Save for later"}
            >
              {saved ? (
                <>
                  <Check className="w-5 h-5 text-[#c2f800]" />
                  <span className="text-[#c2f800]">Saved</span>
                </>
              ) : (
                <>
                  <Bookmark className="w-5 h-5 text-gray-300" />
                  <span>Save for later</span>
                </>
              )}
            </button>
          </div>

          {/* Instructions Section */}
          <div className="space-y-4 pt-4 border-t border-[#1c1f26]">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#c2f800]" />
              <h2 className="font-[family-name:var(--font-oswald)] font-bold text-xl text-white uppercase tracking-tight">
                INSTRUCTIONS
              </h2>
            </div>

            <ol className="space-y-3.5">
              {workout.instructions.map((step, index) => (
                <li
                  key={index}
                  className="flex items-start gap-4 p-4 rounded-xl bg-[#15171d] border border-[#20242e] transition-colors hover:border-[#2d313b]"
                >
                  <span className="w-7 h-7 rounded-lg bg-[#1a2312] border border-[#2d3a20] text-[#c2f800] text-xs font-extrabold flex items-center justify-center shrink-0 mt-0.5">
                    {index + 1}
                  </span>
                  <p className="text-sm text-gray-300 leading-relaxed font-normal">
                    {step}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
