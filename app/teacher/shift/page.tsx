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
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    fetchUser();
    fetchShifts();
  }, []);

  const fetchUser = async () => {
    const { data } = await supabase.auth.getUser();
    const email = data.user?.email || "";
    setUserEmail(email);
  };

  const fetchShifts = async () => {
    const { data } = await supabase
      .from("shifts")
      .select("*")
      .order("date", { ascending: false });

    setShifts((data as Shift[]) || []);
  };

  // 自分のシフトだけ
  const myShifts = shifts.filter(
    (s) => s.email === userEmail
  );

  return (
    <main className="p-6 space-y-6">

      <h1 className="text-2xl font-bold">
        シフト確認
      </h1>

      {/* 自分のシフト */}
      <div className="space-y-3">

        {myShifts.map((s) => (
          <div
            key={s.id}
            className="border p-3 rounded flex justify-between"
          >

            <div>
              <p className="font-bold">
                {s.date}
              </p>
            </div>

            <div>
              {s.status === "available" ? (
                <span className="text-green-600 font-bold">
                  出勤可能
                </span>
              ) : (
                <span className="text-red-500 font-bold">
                  不可
                </span>
              )}
            </div>

          </div>
        ))}

      </div>

    </main>
  );
}