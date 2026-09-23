import React from "react";

export default function WorkoutCardSkeleton() {
  return (
    <div className="flex flex-col justify-between rounded-2xl bg-[#15171d] border border-[#222630] overflow-hidden animate-pulse">
      <div>
        {/* Image skeleton */}
        <div className="w-full aspect-[16/10] bg-[#1c202a]" />

        {/* Content skeleton */}
        <div className="p-5 flex flex-col gap-3">
          <div className="h-6 w-3/4 bg-[#1f2430] rounded-md" />
          <div className="h-4 w-1/2 bg-[#1b1f29] rounded-md" />
        </div>
      </div>

      {/* Footer skeleton */}
      <div className="px-5 pb-5">
        <div className="border-t border-[#20242e] pt-3.5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="h-4 w-14 bg-[#1b1f29] rounded" />
            <div className="h-4 w-16 bg-[#1b1f29] rounded" />
            <div className="h-4 w-10 bg-[#1b1f29] rounded" />
          </div>
          <div className="w-6 h-6 rounded-full bg-[#1b1f29]" />
        </div>
      </div>
    </div>
  );
}
