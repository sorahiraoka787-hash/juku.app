"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

type Shift = {
  id: number;
  email: string;
  date: string;
  start_time: string;
  hours: number;
};

type Record = {
  id: number;
  email: string;
  date: string;
};

export default function TeacherShiftPage() {
  const [userEmail, setUserEmail] = useState("");
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [records, setRecords] = useState<Record[]>([]);

  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    const { data } = await supabase.auth.getUser();
    const email = data.user?.email || "";

    setUserEmail(email);

    if (email) {
      fetchData(email);
    }
  };

  const fetchData = async (email: string) => {
    const [{ data: shiftData }, { data: recordData }] = await Promise.all([
      supabase.from("shifts").select("*").eq("email", email),
      supabase.from("work_records").select("*").eq("email", email),
    ]);

    setShifts((shiftData as Shift[]) || []);
    setRecords((recordData as Record[]) || []);
  };

  // 判定
  const hasShift = (date: string) =>
    shifts.some((s) => s.date === date);

  const hasRecord = (date: string) =>
    records.some((r) => r.date === date);

  return (
    <main className="p-6 space-y-6">

      <h1 className="text-2xl font-bold">
        シフトカレンダー
      </h1>

      <div className="border rounded p-4">

        <Calendar
          tileClassName={({ date }) => {
            const d = date.toISOString().split("T")[0];

            const shift = hasShift(d);
            const record = hasRecord(d);

            if (shift && record) {
              return "bg-purple-300"; // 両方
            }

            if (shift) {
              return "bg-blue-300"; // シフト
            }

            if (record) {
              return "bg-green-300"; // 勤怠
            }

            return "";
          }}
        />

        {/* 凡例 */}
        <div className="flex gap-4 mt-4 text-sm">

          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-blue-300" />
            シフト
          </div>

          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-green-300" />
            勤怠
          </div>

          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-purple-300" />
            両方
          </div>

        </div>

      </div>

    </main>
  );
}