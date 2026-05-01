"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Shift = {
  id: number;
  email: string;
  date: string;
  status: "available" | "unavailable";
};

export default function AdminShiftPage() {
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [status, setStatus] = useState<"available" | "unavailable">("available");

  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();

  const end = new Date(year, month + 1, 0);

  const days = Array.from(
    { length: end.getDate() },
    (_, i) => new Date(year, month, i + 1)
  );

  const fetchShifts = async () => {
    const { data, error } = await supabase.from("shifts").select("*");

    if (error) {
      console.error(error);
      return;
    }

    setShifts((data as Shift[]) || []);
  };

  useEffect(() => {
    fetchShifts();
  }, []);

  const getShiftByDate = (date: string) => {
    return shifts.filter((s) => s.date === date);
  };

  const saveShift = async () => {
    const email = prompt("講師のメールアドレスを入力");

    if (!email || !selectedDate) return;

    const existing = shifts.find(
      (s) => s.email === email && s.date === selectedDate
    );

    if (existing) {
      await supabase
        .from("shifts")
        .update({ status })
        .eq("id", existing.id);
    } else {
      await supabase.from("shifts").insert([
        {
          email,
          date: selectedDate,
          status,
        },
      ]);
    }

    setSelectedDate("");
    fetchShifts();
  };

  return (
    <main className="p-6 space-y-6">

      <h1 className="text-2xl font-bold">
        シフト管理（admin）
      </h1>

      {/* カレンダー */}
      <div className="grid grid-cols-7 gap-2">

        {days.map((day) => {
          const dateStr = day.toISOString().slice(0, 10);
          const dayShifts = getShiftByDate(dateStr);

          return (
            <div
              key={dateStr}
              onClick={() => setSelectedDate(dateStr)}
              className="border p-2 rounded cursor-pointer text-sm"
            >
              <p className="font-bold">{day.getDate()}</p>

              <div className="space-y-1 mt-1">
                {dayShifts.map((s) => (
                  <div
                    key={s.id}
                    className={`text-xs px-1 rounded
                      ${
                        s.status === "available"
                          ? "bg-green-200"
                          : "bg-red-200"
                      }
                    `}
                  >
                    {s.email.split("@")[0]}
                  </div>
                ))}
              </div>
            </div>
          );
        })}

      </div>

      {/* 編集パネル */}
      {selectedDate && (
        <div className="border p-4 rounded space-y-3">

          <p>選択日：{selectedDate}</p>

          <select
            value={status}
            onChange={(e) =>
              setStatus(e.target.value as any)
            }
            className="border p-2"
          >
            <option value="available">出勤可能</option>
            <option value="unavailable">不可</option>
          </select>

          <button
            onClick={saveShift}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            保存
          </button>

        </div>
      )}

    </main>
  );
}