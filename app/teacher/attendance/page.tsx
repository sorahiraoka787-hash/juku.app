"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function AttendancePage() {
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    try {
      setLoading(true);

      // ログイン確認
      const { data: userData, error: userError } =
        await supabase.auth.getUser();

      if (userError || !userData.user?.email) {
        alert("ログイン情報が取得できません");
        return;
      }

      const email = userData.user.email;

      // 入力チェック
      if (!date || !startTime || !endTime) {
        alert("すべて入力してください");
        return;
      }

      const { error } = await supabase
        .from("work_record") // ← テーブル名注意
        .insert([
          {
            email,
            date,
            startTime,
            endTime,
          },
        ]);

      if (error) {
        console.error(error);
        alert("送信失敗");
        return;
      }

      alert("勤怠送信完了");

      // リセット
      setDate("");
      setStartTime("");
      setEndTime("");

    } catch (e) {
      console.error("unexpected error:", e);
      alert("エラーが発生しました");
    } finally {
      setLoading(false);
    }
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
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 disabled:opacity-50"
      >
        {loading ? "送信中..." : "送信"}
      </button>

    </main>
  );
}