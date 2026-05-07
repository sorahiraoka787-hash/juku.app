"use client";

import { useEffect, useMemo, useState } from "react";
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

type WorkRecord = {
  id: number;
  email: string;
  date: string;
};

export default function TeacherShiftPage() {
  const [userEmail, setUserEmail] = useState("");
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [records, setRecords] = useState<WorkRecord[]>([]);

  useEffect(() => {
    const init = async () => {
      const { data } = await supabase.auth.getUser();
      const email = data.user?.email || "";
      if (!email) return;

      setUserEmail(email);

      const [{ data: shiftData }, { data: recordData }] =
        await Promise.all([
          supabase.from("shifts").select("*").eq("email", email),
          supabase.from("work_records").select("*").eq("email", email),
        ]);

      setShifts(shiftData || []);
      setRecords(recordData || []);
    };

    init();
  }, []);

  // 🔥 事前に高速検索用Setを作る（超重要）
  const shiftSet = useMemo(() => {
    return new Set(shifts.map((s) => s.date));
  }, [shifts]);

  const recordSet = useMemo(() => {
    return new Set(records.map((r) => r.date));
  }, [records]);

  const getClass = (date: Date) => {
    const d = date.toISOString().split("T")[0];

    const shift = shiftSet.has(d);
    const record = recordSet.has(d);

    if (shift && record) return "bg-purple-400 text-white rounded-md";
    if (shift) return "bg-blue-400 text-white rounded-md";
    if (record) return "bg-green-400 text-white rounded-md";

    return "";
  };

  return (
    <main className="p-6 space-y-6">

      <h1 className="text-2xl font-bold">
        シフトカレンダー
      </h1>

      <div className="border rounded p-4">

        <Calendar
          tileClassName={({ date }) => getClass(date)}
        />

      </div>

    </main>
  );
}