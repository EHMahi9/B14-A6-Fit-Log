export interface Workout {
  id: number;
  name: string;
  image: string;
  muscleGroups: string[];
  equipment: string;
  difficulty: string;
  duration: number; // in minutes, e.g. 25
  caloriesBurned: number; // in kcal, e.g. 180
  sets: number;
  reps: string;
  rating: number;
  description: string;
  instructions: string[];
}

export interface PlannedWorkout extends Workout {
  completed?: boolean;
  addedAt?: string;
}

export type SortOption = "Duration" | "Calories" | "Rating";
