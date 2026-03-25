import { NextResponse, NextRequest } from "next/server";
import dbConnect from "@/lib/mongodb";
import Habit from "@/models/Habit";

export async function GET(
  request: NextRequest,
  context: { params: { date: string } },
) {
  await dbConnect();
  const date = context.params.date;

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
  context: { params: { date: string } },
) {
  await dbConnect();
  const date = context.params.date;
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
