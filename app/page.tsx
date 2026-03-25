"use client";
import { useState, useEffect } from "react";

export default function Home() {
  const today = new Date().toISOString().split("T")[0];
  const [date] = useState(today);
  const [loading, setLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState("");

  const [habits, setHabits] = useState({
    waterDrank: false,
    morningYoga: false,
    blackCoffee: false,
    breakFast10AM: false,
    lunch2PM: false,
    walkAfterLunch: false,
    snack4PM: false,
    deskDinner6PM: false,
    nightYoga: false,
    stepsCount: 0,
  });

  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/habits/${date}`);
        const data = await res.json();
        if (isMounted) {
          setHabits({
            waterDrank: data.waterDrank || false,
            morningYoga: data.morningYoga || false,
            blackCoffee: data.blackCoffee || false,
            breakFast10AM: data.breakFast10AM || false,
            lunch2PM: data.lunch2PM || false,
            walkAfterLunch: data.walkAfterLunch || false,
            snack4PM: data.snack4PM || false,
            deskDinner6PM: data.deskDinner6PM || false,
            nightYoga: data.nightYoga || false,
            stepsCount: data.stepsCount || 0,
          });
        }
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchData();
    return () => {
      isMounted = false;
    };
  }, [date]);

  // Update Boolean Toggles
  const handleToggle = async (
    field: keyof typeof habits,
    currentValue: boolean | number,
  ) => {
    setHabits((prev) => ({ ...prev, [field]: !currentValue }));
    updateDatabase(field, !currentValue);
  };

  // Update Numeric Steps
  const handleStepsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSteps = Number(e.target.value);
    setHabits((prev) => ({ ...prev, stepsCount: newSteps }));
  };

  const saveSteps = () => {
    updateDatabase("stepsCount", habits.stepsCount);
  };

  // Generic DB Update Function
  const updateDatabase = async (field: string, value: boolean | number) => {
    setSaveStatus("Saving...");
    try {
      await fetch(`/api/habits/${date}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [field]: value }),
      });
      setSaveStatus("Saved ✅");
      setTimeout(() => setSaveStatus(""), 2000);
    } catch (err) {
      setSaveStatus("Error ❌");
    }
  };

  // Reusable Checkbox Component
  const CheckboxRow = ({
    field,
    label,
    desc,
  }: {
    field: keyof typeof habits;
    label: string;
    desc?: string;
  }) => (
    <label className="flex items-start space-x-3 cursor-pointer p-3 hover:bg-gray-50 rounded-lg border border-gray-100 transition-colors">
      <input
        type="checkbox"
        checked={habits[field] as boolean}
        onChange={() => handleToggle(field, habits[field])}
        className="w-5 h-5 mt-1 text-blue-600 rounded"
      />
      <div>
        <span
          className={`block text-lg font-medium ${habits[field] ? "line-through text-gray-400" : "text-gray-800"}`}
        >
          {label}
        </span>
        {desc && (
          <span
            className={`text-sm ${habits[field] ? "text-gray-300" : "text-gray-500"}`}
          >
            {desc}
          </span>
        )}
      </div>
    </label>
  );

  return (
    <main className="min-h-screen bg-slate-100 p-4 md:p-8 flex flex-col items-center font-sans">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="bg-slate-800 p-6 text-white text-center relative">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            ⏱️ 10-to-6 Blueprint
          </h1>
          <p className="text-slate-300 mt-2 font-mono">{date}</p>
          {saveStatus && (
            <span className="absolute top-4 right-4 text-xs bg-slate-700 px-2 py-1 rounded text-green-400">
              {saveStatus}
            </span>
          )}
        </div>

        {loading ? (
          <div className="p-12 text-center text-slate-500">
            Loading your schedule...
          </div>
        ) : (
          <div className="p-6 space-y-8">
            {/* Steps Tracker (CRUD Input) */}
            <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-blue-900">👟 Daily Steps</h3>
                <p className="text-sm text-blue-700">Goal: 10,000</p>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  value={habits.stepsCount}
                  onChange={handleStepsChange}
                  onBlur={saveSteps}
                  className="w-24 p-2 border border-blue-200 rounded text-center font-bold text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <button
                  onClick={saveSteps}
                  className="px-3 py-2 bg-blue-600 text-white rounded font-medium hover:bg-blue-700"
                >
                  Save
                </button>
              </div>
            </div>

            {/* Morning Block */}
            <section>
              <h2 className="text-xl font-bold text-slate-800 mb-3 border-b pb-2">
                🌅 Morning (Fast & Prime)
              </h2>
              <div className="space-y-2">
                <CheckboxRow
                  field="waterDrank"
                  label="1L Water"
                  desc="Immediately upon waking"
                />
                <CheckboxRow
                  field="morningYoga"
                  label="30 mins Yoga"
                  desc="Surya Namaskar & Breathing"
                />
                <CheckboxRow
                  field="blackCoffee"
                  label="Black Coffee/Tea"
                  desc="Strictly no sugar"
                />
              </div>
            </section>

            {/* Mid-Day Block */}
            <section>
              <h2 className="text-xl font-bold text-slate-800 mb-3 border-b pb-2">
                🍲 Mid-Day (Fuel)
              </h2>
              <div className="space-y-2">
                <CheckboxRow
                  field="breakFast10AM"
                  label="10:00 AM: Break Fast"
                  desc="Eggs, guava, or thick curd"
                />
                <CheckboxRow
                  field="lunch2PM"
                  label="2:00 PM: Main Meal"
                  desc="Soya chunks/Mushroom, veg poriyal, small carb"
                />
                <CheckboxRow
                  field="walkAfterLunch"
                  label="10 Min Walk"
                  desc="Right after lunch to manage blood sugar"
                />
              </div>
            </section>

            {/* Evening Block */}
            <section>
              <h2 className="text-xl font-bold text-slate-800 mb-3 border-b pb-2">
                🌇 Evening (Wind Down)
              </h2>
              <div className="space-y-2">
                <CheckboxRow
                  field="snack4PM"
                  label="4:00 PM: Snack"
                  desc="Whey protein or Marie Gold + black tea"
                />
                <CheckboxRow
                  field="deskDinner6PM"
                  label="6:00 PM: Desk Dinner"
                  desc="Cucumber/radish salad or watermelon. Fasting starts at 6:30!"
                />
                <CheckboxRow
                  field="nightYoga"
                  label="Night Yoga"
                  desc="Deep breathing only before bed"
                />
              </div>
            </section>
          </div>
        )}
      </div>
    </main>
  );
}
