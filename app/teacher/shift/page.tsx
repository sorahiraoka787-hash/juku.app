"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Shift = {
  id: number;
  email: string;
  date: string;
  status: "available" | "unavailable";
};

export default function TeacherShiftPage() {
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [userEmail, setUserEmail] = useState<string>("");

  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();

  const end = new Date(year, month + 1, 0);

  const days = Array.from(
    { length: end.getDate() },
    (_, i) => new Date(year, month, i + 1)
  );

  // 🔹 ユーザー取得（ここが修正ポイント）
  const fetchUser = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    setUserEmail(user?.email || "");
  };

  const fetchShifts = async () => {
    const { data, error } = await supabase
      .from("shifts")
      .select("*");

    if (error) {
      console.error(error);
      return;
    }

    setShifts((data as Shift[]) || []);
  };

  useEffect(() => {
    fetchUser();
    fetchShifts();
  }, []);

  const getShift = (date: string) => {
    return shifts.find((s) => s.date === date);
  };

  return (
    <main className="p-6 space-y-6">

      <h1 className="text-2xl font-bold">
        シフト確認（閲覧のみ）
      </h1>

      {/* カレンダー */}
      <div className="grid grid-cols-7 gap-2">

        {days.map((day) => {
          const dateStr = day.toISOString().slice(0, 10);
          const shift = getShift(dateStr);

          const isMine = shift?.email === userEmail;

          return (
            <div
              key={dateStr}
              className={`border p-2 rounded text-sm
                ${
                  shift?.status === "available"
                    ? "bg-green-100"
                    : shift?.status === "unavailable"
                    ? "bg-red-100"
                    : ""
                }
                ${isMine ? "border-blue-500 border-2" : ""}
              `}
            >
              <p>{day.getDate()}</p>
              <p className="text-xs">
                {shift?.status || "-"}
              </p>
            </div>
          );
        })}

      </div>

    </main>
  );
}