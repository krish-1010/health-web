import mongoose from "mongoose";

const HabitSchema = new mongoose.Schema({
  date: { type: String, required: true, unique: true },
  waterDrank: { type: Boolean, default: false },
  yogaDone: { type: Boolean, default: false },
  eggsEaten: { type: Boolean, default: false },
  stepsCount: { type: Number, default: 0 },
});

export default mongoose.models.Habit || mongoose.model("Habit", HabitSchema);
