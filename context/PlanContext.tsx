"use client";

import React, {
  createContext,
  useContext,
  useSyncExternalStore,
  useCallback,
  useState,
} from "react";
import { Workout, PlannedWorkout } from "@/types/workout";
import { useToast } from "@/components/ui/Toast";

interface PlanContextType {
  plan: PlannedWorkout[];
  saved: Workout[];
  isLoaded: boolean;
  activeTab: "plan" | "saved";
  setActiveTab: (tab: "plan" | "saved") => void;
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

// Storage subscribers for React 19 useSyncExternalStore
const storageSubscribers = new Set<() => void>();

function subscribe(callback: () => void) {
  storageSubscribers.add(callback);
  const handleStorage = (e: StorageEvent) => {
    if (e.key === PLAN_STORAGE_KEY || e.key === SAVED_STORAGE_KEY) {
      callback();
    }
  };
  window.addEventListener("storage", handleStorage);
  return () => {
    storageSubscribers.delete(callback);
    window.removeEventListener("storage", handleStorage);
  };
}

function emitStorageChange() {
  storageSubscribers.forEach((cb) => cb());
}

let cachedPlanRaw: string | null = null;
let cachedPlanParsed: PlannedWorkout[] = [];

function getPlanSnapshot(): PlannedWorkout[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(PLAN_STORAGE_KEY);
    if (raw !== cachedPlanRaw) {
      cachedPlanRaw = raw;
      cachedPlanParsed = raw ? JSON.parse(raw) : [];
    }
    return cachedPlanParsed;
  } catch {
    return [];
  }
}

let cachedSavedRaw: string | null = null;
let cachedSavedParsed: Workout[] = [];

function getSavedSnapshot(): Workout[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(SAVED_STORAGE_KEY);
    if (raw !== cachedSavedRaw) {
      cachedSavedRaw = raw;
      cachedSavedParsed = raw ? JSON.parse(raw) : [];
    }
    return cachedSavedParsed;
  } catch {
    return [];
  }
}

const emptyPlan: PlannedWorkout[] = [];
const emptySaved: Workout[] = [];

function getServerPlanSnapshot(): PlannedWorkout[] {
  return emptyPlan;
}

function getServerSavedSnapshot(): Workout[] {
  return emptySaved;
}

export function PlanProvider({ children }: { children: React.ReactNode }) {
  const plan = useSyncExternalStore(
    subscribe,
    getPlanSnapshot,
    getServerPlanSnapshot
  );
  const saved = useSyncExternalStore(
    subscribe,
    getSavedSnapshot,
    getServerSavedSnapshot
  );
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<"plan" | "saved">("plan");

  const isPlanned = useCallback(
    (workoutId: number) => {
      return plan.some((item) => item.id === workoutId);
    },
    [plan]
  );

  const isSaved = useCallback(
    (workoutId: number) => {
      return saved.some((item) => item.id === workoutId);
    },
    [saved]
  );

  const setPlanStorage = useCallback((newPlan: PlannedWorkout[]) => {
    try {
      localStorage.setItem(PLAN_STORAGE_KEY, JSON.stringify(newPlan));
      cachedPlanRaw = JSON.stringify(newPlan);
      cachedPlanParsed = newPlan;
      emitStorageChange();
    } catch (e) {
      console.error("Failed to write plan to localStorage", e);
    }
  }, []);

  const setSavedStorage = useCallback((newSaved: Workout[]) => {
    try {
      localStorage.setItem(SAVED_STORAGE_KEY, JSON.stringify(newSaved));
      cachedSavedRaw = JSON.stringify(newSaved);
      cachedSavedParsed = newSaved;
      emitStorageChange();
    } catch (e) {
      console.error("Failed to write saved list to localStorage", e);
    }
  }, []);

  const addToPlan = useCallback(
    (workout: Workout): boolean => {
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

      const updated = [...plan, newPlannedItem];
      setPlanStorage(updated);
      showToast(`Added ${workout.name} to today's plan!`, "success");
      return true;
    },
    [plan, isPlanned, setPlanStorage, showToast]
  );

  const removeFromPlan = useCallback(
    (workoutId: number) => {
      const item = plan.find((p) => p.id === workoutId);
      const updated = plan.filter((p) => p.id !== workoutId);
      setPlanStorage(updated);
      showToast(
        item
          ? `Removed ${item.name} from today's plan`
          : "Workout removed from plan",
        "info"
      );
    },
    [plan, setPlanStorage, showToast]
  );

  const markAsDone = useCallback(
    (workoutId: number) => {
      let toggledItem: PlannedWorkout | undefined;
      const updated = plan.map((item) => {
        if (item.id === workoutId) {
          toggledItem = { ...item, completed: !item.completed };
          return toggledItem;
        }
        return item;
      });
      setPlanStorage(updated);
      if (toggledItem) {
        showToast(
          toggledItem.completed
            ? `Completed ${toggledItem.name}! Keep crushing it.`
            : `Marked ${toggledItem.name} as incomplete`,
          "success"
        );
      }
    },
    [plan, setPlanStorage, showToast]
  );

  const addToSaved = useCallback(
    (workout: Workout): boolean => {
      if (isSaved(workout.id)) {
        showToast(`${workout.name} is already saved for later!`, "info");
        return false;
      }

      const updated = [...saved, workout];
      setSavedStorage(updated);
      showToast(`Saved ${workout.name} for later!`, "success");
      return true;
    },
    [saved, isSaved, setSavedStorage, showToast]
  );

  const removeFromSaved = useCallback(
    (workoutId: number) => {
      const item = saved.find((s) => s.id === workoutId);
      const updated = saved.filter((s) => s.id !== workoutId);
      setSavedStorage(updated);
      showToast(
        item ? `Removed ${item.name} from saved` : "Workout removed from saved",
        "info"
      );
    },
    [saved, setSavedStorage, showToast]
  );

  // Live Metrics calculations
  const totalExercises = plan.length;
  const totalMinutes = plan.reduce(
    (sum, item) => sum + (item.duration || 0),
    0
  );
  const totalCalories = plan.reduce(
    (sum, item) => sum + (item.caloriesBurned || 0),
    0
  );

  return (
    <PlanContext.Provider
      value={{
        plan,
        saved,
        isLoaded: true,
        activeTab,
        setActiveTab,
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
