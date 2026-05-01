"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function AttendancePage() {
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const submit = async () => {
    const user = await supabase.auth.getUser();
    const email = user.data.user?.email;

    const { error } = await supabase.from("work-record").insert([
      {
        email,
        date,
        startTime,
        endTime,
      },
    ]);

    if (error) {
      alert("送信失敗");
      return;
    }

    alert("勤怠送信完了");
  };

  return (
    <main className="p-6 space-y-6">

      <h1 className="text-2xl font-bold">
        勤怠入力
      </h1>

      <input
        type="date"
        className="border p-2 block"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />

      <input
        type="time"
        className="border p-2 block"
        value={startTime}
        onChange={(e) => setStartTime(e.target.value)}
      />

      <input
        type="time"
        className="border p-2 block"
        value={endTime}
        onChange={(e) => setEndTime(e.target.value)}
      />

      <button
        onClick={submit}
        className="bg-blue-600 text-white px-4 py-2"
      >
        送信
      </button>

    </main>
  );
}