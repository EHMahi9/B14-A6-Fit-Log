import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Workout } from "@/types/workout";
import { Clock, Flame, Star, ChevronRight } from "lucide-react";

interface WorkoutCardProps {
  workout: Workout;
}

export default function WorkoutCard({ workout }: WorkoutCardProps) {
  return (
    <Link
      href={`/workout/${workout.id}`}
      className="group flex flex-col justify-between rounded-2xl bg-[#15171d] border border-[#222630] hover:border-[#c2f800]/50 hover:shadow-[0_8px_30px_rgba(0,0,0,0.5)] transition-all duration-300 overflow-hidden hover:-translate-y-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c2f800]"
    >
      <div>
        {/* Thumbnail Image Container */}
        <div className="relative w-full aspect-[16/10] bg-[#1a1d24] overflow-hidden">
          <Image
            src={workout.image}
            alt={workout.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
          />
          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#15171d] via-transparent to-transparent opacity-80" />

          {/* Category Tag Pills (top-left over image or right under image) */}
          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
            {workout.muscleGroups.map((group) => (
              <span
                key={group}
                className="px-2.5 py-0.5 rounded-full bg-[#0c0d10]/80 backdrop-blur-md border border-[#2d3a20] text-[#c2f800] text-[10px] font-extrabold uppercase tracking-wider shadow-sm"
              >
                {group}
              </span>
            ))}
          </div>
        </div>

        {/* Card Content */}
        <div className="p-5 flex flex-col gap-2">
          {/* Workout Name */}
          <h3 className="font-[family-name:var(--font-oswald)] font-bold text-xl text-white uppercase tracking-tight group-hover:text-[#c2f800] transition-colors leading-tight line-clamp-1">
            {workout.name}
          </h3>

          {/* Equipment line */}
          <p className="text-xs text-gray-400 font-medium tracking-tight">
            {workout.equipment}
          </p>
        </div>
      </div>

      {/* Card Footer: Stats Row */}
      <div className="px-5 pb-5 pt-0">
        <div className="border-t border-[#20242e] pt-3.5 flex items-center justify-between text-xs text-gray-300">
          <div className="flex items-center gap-3.5">
            {/* Duration */}
            <div className="flex items-center gap-1.5" title="Duration">
              <Clock className="w-3.5 h-3.5 text-gray-400" />
              <span className="font-semibold text-gray-200">{workout.duration} min</span>
            </div>

            {/* Calories */}
            <div className="flex items-center gap-1.5" title="Calories Burned">
              <Flame className="w-3.5 h-3.5 text-amber-400/90" />
              <span className="font-semibold text-gray-200">{workout.caloriesBurned} kcal</span>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-1.5" title="Rating">
              <Star className="w-3.5 h-3.5 text-[#c2f800] fill-[#c2f800]" />
              <span className="font-semibold text-gray-200">{workout.rating}</span>
            </div>
          </div>

          {/* Detail chevron hint */}
          <div className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center text-gray-400 group-hover:text-[#c2f800] group-hover:bg-[#c2f800]/10 transition-colors">
            <ChevronRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
          </div>
        </div>
      </div>
    </Link>
  );
}
