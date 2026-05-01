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
  const [email, setEmail] = useState("");
  const [date, setDate] = useState("");
  const [status, setStatus] = useState<"available" | "unavailable">("available");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const { data } = await supabase.from("shifts").select("*");
    setShifts((data as Shift[]) || []);
  };

  const save = async () => {
    const existing = shifts.find(
      (s) => s.email === email && s.date === date
    );

    if (existing) {
      await supabase
        .from("shifts")
        .update({ status })
        .eq("id", existing.id);
    } else {
      await supabase.from("shifts").insert([
        { email, date, status },
      ]);
    }

    fetchData();
  };

  return (
    <main className="p-6 space-y-4">

      <h1 className="text-xl font-bold">シフト管理</h1>

      <input
        placeholder="email"
        className="border p-2 block"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="date"
        className="border p-2 block"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />

      <select
        className="border p-2 block"
        value={status}
        onChange={(e) => setStatus(e.target.value as any)}
      >
        <option value="available">出勤可能</option>
        <option value="unavailable">不可</option>
      </select>

      <button
        onClick={save}
        className="bg-blue-600 text-white px-4 py-2"
      >
        保存
      </button>

    </main>
  );
}