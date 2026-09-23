"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Workout, PlannedWorkout } from "@/types/workout";
import { useToast } from "@/components/ui/Toast";

interface PlanContextType {
  plan: PlannedWorkout[];
  saved: Workout[];
  isLoaded: boolean;
  addToPlan: (workout: Workout) => boolean;
  removeFromPlan: (workoutId: number) => void;
  markAsDone: (workoutId: number) => void;
  addToSaved: (workout: Workout) => boolean;
  removeFromSaved: (workoutId: number) => void;
  isPlanned: (workoutId: number) => boolean;
  isSaved: (workoutId: number) => boolean;
  totalExercises: number;
  totalMinutes: number;
  totalCalories: number;
}

const PlanContext = createContext<PlanContextType | undefined>(undefined);

const PLAN_STORAGE_KEY = "fitlog_today_plan_v1";
const SAVED_STORAGE_KEY = "fitlog_saved_workouts_v1";
const MAX_PLAN_LIFTS = 5;

export function PlanProvider({ children }: { children: React.ReactNode }) {
  const [plan, setPlan] = useState<PlannedWorkout[]>([]);
  const [saved, setSaved] = useState<Workout[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const { showToast } = useToast();

  // Load from localStorage on client mount
  useEffect(() => {
    try {
      const storedPlan = localStorage.getItem(PLAN_STORAGE_KEY);
      const storedSaved = localStorage.getItem(SAVED_STORAGE_KEY);

      if (storedPlan) {
        setPlan(JSON.parse(storedPlan));
      }
      if (storedSaved) {
        setSaved(JSON.parse(storedSaved));
      }
    } catch (e) {
      console.error("Failed to load plans from localStorage", e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save to localStorage when state changes
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(PLAN_STORAGE_KEY, JSON.stringify(plan));
    } catch (e) {
      console.error("Failed to persist plan to localStorage", e);
    }
  }, [plan, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(SAVED_STORAGE_KEY, JSON.stringify(saved));
    } catch (e) {
      console.error("Failed to persist saved list to localStorage", e);
    }
  }, [saved, isLoaded]);

  const isPlanned = (workoutId: number) => {
    return plan.some((item) => item.id === workoutId);
  };

  const isSaved = (workoutId: number) => {
    return saved.some((item) => item.id === workoutId);
  };

  const addToPlan = (workout: Workout): boolean => {
    if (isPlanned(workout.id)) {
      showToast(`${workout.name} is already in today's plan!`, "info");
      return false;
    }

    if (plan.length >= MAX_PLAN_LIFTS) {
      showToast(
        `Cap reached! Maximum of ${MAX_PLAN_LIFTS} lifts allowed for today.`,
        "warning"
      );
      return false;
    }

    const newPlannedItem: PlannedWorkout = {
      ...workout,
      completed: false,
      addedAt: new Date().toISOString(),
    };

    setPlan((prev) => [...prev, newPlannedItem]);
    showToast(`Added ${workout.name} to today's plan!`, "success");
    return true;
  };

  const removeFromPlan = (workoutId: number) => {
    const item = plan.find((p) => p.id === workoutId);
    setPlan((prev) => prev.filter((p) => p.id !== workoutId));
    showToast(
      item ? `Removed ${item.name} from today's plan` : "Workout removed from plan",
      "info"
    );
  };

  const markAsDone = (workoutId: number) => {
    setPlan((prev) =>
      prev.map((item) => {
        if (item.id === workoutId) {
          const nextState = !item.completed;
          showToast(
            nextState
              ? `Completed ${item.name}! Keep crushing it.`
              : `Marked ${item.name} as incomplete`,
            "success"
          );
          return { ...item, completed: nextState };
        }
        return item;
      })
    );
  };

  const addToSaved = (workout: Workout): boolean => {
    if (isSaved(workout.id)) {
      showToast(`${workout.name} is already saved for later!`, "info");
      return false;
    }

    setSaved((prev) => [...prev, workout]);
    showToast(`Saved ${workout.name} for later!`, "success");
    return true;
  };

  const removeFromSaved = (workoutId: number) => {
    const item = saved.find((s) => s.id === workoutId);
    setSaved((prev) => prev.filter((s) => s.id !== workoutId));
    showToast(
      item ? `Removed ${item.name} from saved` : "Workout removed from saved",
      "info"
    );
  };

  // Live Metrics calculations
  const totalExercises = plan.length;
  const totalMinutes = plan.reduce((sum, item) => sum + (item.duration || 0), 0);
  const totalCalories = plan.reduce(
    (sum, item) => sum + (item.caloriesBurned || 0),
    0
  );

  return (
    <PlanContext.Provider
      value={{
        plan,
        saved,
        isLoaded,
        addToPlan,
        removeFromPlan,
        markAsDone,
        addToSaved,
        removeFromSaved,
        isPlanned,
        isSaved,
        totalExercises,
        totalMinutes,
        totalCalories,
      }}
    >
      {children}
    </PlanContext.Provider>
  );
}

export function usePlan() {
  const context = useContext(PlanContext);
  if (!context) {
    throw new Error("usePlan must be used within a PlanProvider");
  }
  return context;
}
