"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function AttendancePage() {
  const [date, setDate] = useState("");
  const [startHour, setStartHour] = useState<number>(9);
  const [loading, setLoading] = useState(false);

  const hours = Array.from({ length: 14 }, (_, i) => i + 9); // 9〜22時

  const submit = async () => {
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const email = user?.email;

    if (!email || !date) {
      alert("入力してください");
      setLoading(false);
      return;
    }

    const { error } = await supabase.from("work_records").insert([
      {
        email,
        date,
        startHour,
      },
    ]);

    setLoading(false);

    if (error) {
      console.error(error);
      alert("送信失敗");
      return;
    }

    alert("勤怠登録完了");
    setDate("");
    setStartHour(9);
  };

  return (
    <main className="p-6 space-y-6">

      <h1 className="text-2xl font-bold">
        勤怠入力
      </h1>

      {/* 日付 */}
      <input
        type="date"
        className="border p-2 block"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />

      {/* 時間（プルダウン） */}
      <select
        className="border p-2 block"
        value={startHour}
        onChange={(e) =>
          setStartHour(Number(e.target.value))
        }
      >
        {hours.map((h) => (
          <option key={h} value={h}>
            {h}:00 ～ {h + 1}:00
          </option>
        ))}
      </select>

      {/* 送信 */}
      <button
        onClick={submit}
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2"
      >
        {loading ? "送信中..." : "送信"}
      </button>

    </main>
  );
}