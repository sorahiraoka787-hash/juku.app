"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Shift = {
  id: number;
  email: string;
  date: string;
  start_time: string;
  hours: number;
  status: string;
};

export default function AdminShiftPage() {
  const [shifts, setShifts] = useState<Shift[]>([]);

  const [email, setEmail] = useState("");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [hours, setHours] = useState(1);

  useEffect(() => {
    fetchData();
  }, []);

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

  const fetchData = async () => {
    const { data, error } = await supabase
      .from("shifts")
      .select("*")
      .order("date", { ascending: false });

    if (error) {
      console.error(error);
      return;
    }

    setShifts((data as Shift[]) || []);
  };

  const save = async () => {
    if (!email || !date || !startTime) {
      alert("未入力があります");
      return;
    }

    const { error } = await supabase
      .from("shifts")
      .insert([
        {
          email,
          date,
          start_time: startTime,
          hours,
          status: "scheduled",
        },
      ]);

    if (error) {
      alert(error.message);
      return;
    }

    alert("シフト登録完了");

    setEmail("");
    setDate("");
    setStartTime("");
    setHours(1);

    fetchData();
  };

  const deleteShift = async (id: number) => {
    const ok = confirm("削除しますか？");

    if (!ok) return;

    const { error } = await supabase
      .from("shifts")
      .delete()
      .eq("id", id);

    if (error) {
      alert("削除失敗");
      return;
    }

    fetchData();
  };

  return (
    <main className="p-6 space-y-6">

      <h1 className="text-2xl font-bold">
        シフト管理
      </h1>

      {/* 登録フォーム */}
      <div className="border rounded p-4 space-y-4">

        <input
          placeholder="teacher email"
          className="border p-2 block w-full"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="date"
          className="border p-2 block w-full"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />

        <select
          className="border p-2 block w-full"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
        >
          <option value="">
            開始時間を選択
          </option>

          {timeOptions.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>

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

        <button
          onClick={save}
          className="bg-blue-600 text-white px-4 py-2 rounded w-full"
        >
          登録
        </button>

      </div>

      {/* 一覧 */}
      <div className="space-y-3">

        <h2 className="text-xl font-bold">
          シフト一覧
        </h2>

        {shifts.map((s) => (
          <div
            key={s.id}
            className="border rounded p-4 flex justify-between items-center"
          >

            <div>

              <p className="font-bold">
                {s.email.split("@")[0]}
              </p>

              <p className="text-sm text-gray-500">
                {s.date}
              </p>

              <p className="text-sm text-gray-500">
                {s.start_time} / {s.hours}時間
              </p>

            </div>

            <button
              onClick={() => deleteShift(s.id)}
              className="bg-red-500 text-white px-3 py-1 rounded"
            >
              削除
            </button>

          </div>
        ))}

      </div>

    </main>
  );
}