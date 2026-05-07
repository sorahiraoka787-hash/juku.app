"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type RecordItem = {
  id: string;
  date: string;
  start_time: string;
  hours: number;
};

export default function AttendancePage() {
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [hours, setHours] = useState(1);

  const [records, setRecords] = useState<RecordItem[]>([]);

  useEffect(() => {
    fetchRecords();
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

  const fetchRecords = async () => {
    const user = await supabase.auth.getUser();

    const user_id = user.data.user?.id;

    if (!user_id) return;

    const { data, error } = await supabase
      .from("work_records")
      .select("*")
      .eq("user_id", user_id)
      .order("date", { ascending: false });

    if (error) {
      console.error(error);
      return;
    }

    setRecords(data || []);
  };

  const submit = async () => {
    const user = await supabase.auth.getUser();

    const email = user.data.user?.email;
    const user_id = user.data.user?.id;

    if (!email || !user_id || !date || !startTime) {
      alert("未入力があります");
      return;
    }

    const { error } = await supabase
      .from("work_records")
      .insert([
        {
          user_id,
          email,
          date,
          start_time: startTime,
          hours,
        },
      ]);

    if (error) {
      if (error.message.includes("unique_work_record")) {
        alert("同じ時間の勤怠は既に登録されています");
        return;
      }

      alert(error.message);
      return;
    }

    alert("勤怠送信完了");

    setDate("");
    setStartTime("");
    setHours(1);

    fetchRecords();
  };

  const deleteRecord = async (id: string) => {
    const ok = confirm("削除しますか？");

    if (!ok) return;

    const { error } = await supabase
      .from("work_records")
      .delete()
      .eq("id", id);

    if (error) {
      alert("削除失敗");
      return;
    }

    fetchRecords();
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

      {/* 開始時間 */}
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

      {/* 勤務時間 */}
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
        className="bg-blue-600 text-white px-4 py-2 w-full rounded"
      >
        送信
      </button>

      {/* 一覧 */}
      <div className="space-y-3">

        <h2 className="text-xl font-bold">
          自分の勤怠
        </h2>

        {records.length === 0 && (
          <p className="text-gray-500">
            まだ勤怠がありません
          </p>
        )}

        {records.map((r) => (
          <div
            key={r.id}
            className="border rounded p-4 flex justify-between items-center"
          >

            <div>
              <p className="font-bold">
                {r.date}
              </p>

              <p className="text-sm text-gray-500">
                {r.start_time} / {r.hours}時間
              </p>
            </div>

            <button
              onClick={() => deleteRecord(r.id)}
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