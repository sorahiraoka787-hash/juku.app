"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function AttendancePage() {
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [hours, setHours] = useState(1);

  const timeOptions = [
    "08:00",
    "09:00",
    "10:00",
    "11:00",
    "12:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
    "18:00",
    "19:00",
    "20:00",
    "21:00",
  ];

  const hourOptions = [1, 2, 3, 4, 5, 6, 7, 8];

  const submit = async () => {
    const user = await supabase.auth.getUser();
    const email = user.data.user?.email;
    const user_id = user.data.user?.id;

    if (!email || !user_id || !date || !startTime) {
      alert("未入力があります");
      return;
    }

    const { error } = await supabase.from("work_records").insert([
      {
        user_id,
        email,
        date,
        start_time: startTime,
        hours,
      },
    ]);

    if (error) {
      console.error(error);
      alert("送信失敗");
      return;
    }

    alert("勤怠送信完了");

    setDate("");
    setStartTime("");
    setHours(1);
  };

  return (
    <main className="p-6 space-y-6">

      <h1 className="text-2xl font-bold">
        勤怠入力
      </h1>

      {/* 日付 */}
      <input
        type="date"
        className="border p-2 block w-full"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />

      {/* 開始時間（プルダウン） */}
      <select
        className="border p-2 block w-full"
        value={startTime}
        onChange={(e) => setStartTime(e.target.value)}
      >
        <option value="">開始時間を選択</option>
        {timeOptions.map((t) => (
          <option key={t} value={t}>
            {t}
          </option>
        ))}
      </select>

      {/* 勤務時間（hours） */}
      <select
        className="border p-2 block w-full"
        value={hours}
        onChange={(e) => setHours(Number(e.target.value))}
      >
        {hourOptions.map((h) => (
          <option key={h} value={h}>
            {h}時間
          </option>
        ))}
      </select>

      {/* 送信 */}
      <button
        onClick={submit}
        className="bg-blue-600 text-white px-4 py-2 w-full"
      >
        送信
      </button>

    </main>
  );
}