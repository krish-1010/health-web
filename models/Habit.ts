import mongoose from "mongoose";

const HabitSchema = new mongoose.Schema({
  date: { type: String, required: true, unique: true },

  // Morning
  waterDrank: { type: Boolean, default: false },
  morningYoga: { type: Boolean, default: false },
  blackCoffee: { type: Boolean, default: false },

  // Mid-Day
  breakFast10AM: { type: Boolean, default: false },
  lunch2PM: { type: Boolean, default: false },
  walkAfterLunch: { type: Boolean, default: false },

  // Afternoon / Evening
  snack4PM: { type: Boolean, default: false },
  deskDinner6PM: { type: Boolean, default: false },
  nightYoga: { type: Boolean, default: false },

  // Numeric Data
  stepsCount: { type: Number, default: 0 },
});

export default mongoose.models.Habit || mongoose.model("Habit", HabitSchema);
