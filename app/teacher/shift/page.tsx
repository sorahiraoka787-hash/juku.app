"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function ShiftPage() {
  const [date, setDate] = useState("");
  const [status, setStatus] = useState("available");

  useEffect(() => {
    setDate(new Date().toISOString().slice(0, 10));
  }, []);

  const submitShift = async () => {
    const user = await supabase.auth.getUser();

    const email = user.data.user?.email;

    const { error } = await supabase.from("shifts").insert([
      {
        email,
        date,
        status,
      },
    ]);

    if (error) {
      alert("送信失敗");
      return;
    }

    alert("シフト提出完了");
  };

  return (
    <main className="p-6 space-y-6">

      <h1 className="text-2xl font-bold">
        シフト提出
      </h1>

      {/* 日付 */}
      <input
        type="date"
        className="border p-2"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />

      {/* 状態 */}
      <select
        className="border p-2 block"
        value={status}
        onChange={(e) => setStatus(e.target.value)}
      >
        <option value="available">出勤可能</option>
        <option value="unavailable">不可</option>
      </select>

      {/* 送信 */}
      <button
        onClick={submitShift}
        className="bg-blue-600 text-white px-4 py-2"
      >
        提出
      </button>

    </main>
  );
}