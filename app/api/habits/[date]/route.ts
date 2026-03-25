import { NextResponse, NextRequest } from "next/server";
import dbConnect from "@/lib/mongodb";
import Habit from "@/models/Habit";

// 1. Define the context type where params is a Promise
type RouteContext = {
  params: Promise<{ date: string }>;
};

export async function GET(
  request: NextRequest,
  context: RouteContext, // Use the updated type
) {
  await dbConnect();

  // 2. Await the params before accessing the date
  const { date } = await context.params;

  try {
    let habit = await Habit.findOne({ date });
    if (!habit) {
      habit = await Habit.create({ date });
    }
    return NextResponse.json(habit);
  } catch (error) {
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  context: RouteContext, // Use the updated type
) {
  await dbConnect();

  // 3. Await the params here as well
  const { date } = await context.params;
  const body = await request.json();

  try {
    const updatedHabit = await Habit.findOneAndUpdate({ date }, body, {
      new: true,
    });
    return NextResponse.json(updatedHabit);
  } catch (error) {
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
