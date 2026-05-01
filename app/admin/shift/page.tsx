"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Shift = {
  id: number;
  email: string;
  date: string;
  status: string;
};

export default function AdminShiftsPage() {
  const [shifts, setShifts] = useState<Shift[]>([]);

  useEffect(() => {
    fetchShifts();
  }, []);

  const fetchShifts = async () => {
    const { data } = await supabase
      .from("shifts")
      .select("*")
      .order("date", { ascending: false });

    setShifts(data || []);
  };

  return (
    <main className="p-6 space-y-6">

      <h1 className="text-2xl font-bold">
        シフト一覧（管理）
      </h1>

      <div className="space-y-3">

        {shifts.map((s) => (
          <div
            key={s.id}
            className="border p-3 rounded flex justify-between"
          >

            <div>
              <p className="font-bold">{s.email}</p>
              <p className="text-sm text-gray-500">
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