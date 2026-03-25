"use client";
import { useState, useEffect } from "react";

export default function Home() {
  const today = new Date().toISOString().split("T")[0];
  const [date] = useState(today);
  const [loading, setLoading] = useState(true); // Added loading state
  const [habits, setHabits] = useState({
    waterDrank: false,
    yogaDone: false,
    eggsEaten: false,
  });

  useEffect(() => {
    // We use a separate function or just keep it here,
    // but the key is that setLoading(true) is fine as long
    // as it doesn't trigger an effect that sets loading again.
    let isMounted = true;

    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/habits/${date}`);
        const data = await res.json();
        if (isMounted) {
          setHabits({
            waterDrank: data.waterDrank || false,
            yogaDone: data.yogaDone || false,
            eggsEaten: data.eggsEaten || false,
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
    }; // Cleanup to prevent memory leaks
  }, [date]);

  const handleToggle = async (field: string, currentValue: boolean) => {
    setHabits((prev) => ({ ...prev, [field]: !currentValue }));

    await fetch(`/api/habits/${date}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ [field]: !currentValue }),
    });
  };

  return (
    <main className="min-h-screen bg-gray-50 p-8 flex flex-col items-center font-sans text-gray-800">
      <div className="max-w-md w-full bg-white rounded-xl shadow-md p-6">
        <h1 className="text-2xl font-bold text-center mb-2">
          ⏱️ 10-to-6 Blueprint
        </h1>
        <p className="text-center text-gray-500 mb-8">{date}</p>

        {loading ? (
          <p className="text-center text-gray-400">Loading your habits...</p>
        ) : (
          <div className="space-y-4">
            <label className="flex items-center space-x-3 cursor-pointer p-3 hover:bg-gray-50 rounded-lg border border-gray-100">
              <input
                type="checkbox"
                checked={habits.waterDrank}
                onChange={() => handleToggle("waterDrank", habits.waterDrank)}
                className="w-6 h-6 text-blue-600 rounded"
              />
              <span
                className={`text-lg ${habits.waterDrank ? "line-through text-gray-400" : ""}`}
              >
                Drink 1L water upon waking
              </span>
            </label>

            <label className="flex items-center space-x-3 cursor-pointer p-3 hover:bg-gray-50 rounded-lg border border-gray-100">
              <input
                type="checkbox"
                checked={habits.yogaDone}
                onChange={() => handleToggle("yogaDone", habits.yogaDone)}
                className="w-6 h-6 text-blue-600 rounded"
              />
              <span
                className={`text-lg ${habits.yogaDone ? "line-through text-gray-400" : ""}`}
              >
                30 mins Morning Yoga
              </span>
            </label>

            <label className="flex items-center space-x-3 cursor-pointer p-3 hover:bg-gray-50 rounded-lg border border-gray-100">
              <input
                type="checkbox"
                checked={habits.eggsEaten}
                onChange={() => handleToggle("eggsEaten", habits.eggsEaten)}
                className="w-6 h-6 text-blue-600 rounded"
              />
              <span
                className={`text-lg ${habits.eggsEaten ? "line-through text-gray-400" : ""}`}
              >
                10:00 AM: Eat Eggs/Curd
              </span>
            </label>
          </div>
        )}
      </div>
    </main>
  );
}
