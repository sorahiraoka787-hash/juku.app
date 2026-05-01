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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchShifts();
  }, []);

  const fetchShifts = async () => {
    try {
      setLoading(true);

      const { data, error } = await supabase
        .from("shifts")
        .select("*")
        .order("date", { ascending: false });

      if (error) {
        console.error("shift error:", error);
        setLoading(false);
        return;
      }

      setShifts(data || []);

    } catch (e) {
      console.error("unexpected error:", e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="p-6 space-y-6">

      <h1 className="text-2xl font-bold">
        シフト一覧（管理）
      </h1>

      {loading && (
        <p>読み込み中...</p>
      )}

      {!loading && (
        <div className="space-y-3">

          {shifts.length === 0 && (
            <p>シフトデータがありません</p>
          )}

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
      )}

    </main>
  );
}