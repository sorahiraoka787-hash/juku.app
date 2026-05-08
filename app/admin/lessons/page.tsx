"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

type Profile = {
  id: string;
  email: string;
  name: string;
};

type Lesson = {
  id: number;
  teacher_id: string;
  date: string;
  start_time: string;
  hours: number;
};

export default function AdminLessonsPage() {
  const [teachers, setTeachers] = useState<Profile[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);

  const [teacherId, setTeacherId] = useState("");
  const [dates, setDates] = useState<Date[]>([]);
  const [startTime, setStartTime] = useState("");
  const [hours, setHours] = useState(1);

  useEffect(() => {
    fetchTeachers();
    fetchLessons();
  }, []);

  const fetchTeachers = async () => {
    const { data } = await supabase.from("profiles").select("*");
    setTeachers(data || []);
  };

  const fetchLessons = async () => {
    const { data } = await supabase.from("lessons").select("*");
    setLessons(data || []);
  };

  // 日付複数選択
  const onClickDay = (date: Date) => {
    const exists = dates.find(
      (d) => d.toDateString() === date.toDateString()
    );

    if (exists) {
      setDates(dates.filter((d) => d.toDateString() !== date.toDateString()));
    } else {
      setDates([...dates, date]);
    }
  };

  // 作成
  const createLessons = async () => {
    if (!teacherId || dates.length === 0 || !startTime) {
      alert("未入力があります");
      return;
    }

    const insertData = dates.map((d) => ({
      teacher_id: teacherId,
      date: d.toISOString().split("T")[0],
      start_time: startTime,
      hours,
      status: "scheduled",
    }));

    const { error } = await supabase.from("lessons").insert(insertData);

    if (error) {
      alert(error.message);
      return;
    }

    alert("作成完了");

    setDates([]);
    setTeacherId("");
    setStartTime("");
    setHours(1);

    fetchLessons();
  };

  // 削除
  const deleteLesson = async (id: number) => {
    const ok = confirm("削除しますか？");
    if (!ok) return;

    const { error } = await supabase
      .from("lessons")
      .delete()
      .eq("id", id);

    if (error) {
      alert(error.message);
      return;
    }

    fetchLessons();
  };

  return (
    <main className="p-6 space-y-6">

      <h1 className="text-xl font-bold">
        授業作成（Admin）
      </h1>

      {/* 講師ドロップダウン */}
      <select
        className="border p-2 w-full"
        value={teacherId}
        onChange={(e) => setTeacherId(e.target.value)}
      >
        <option value="">講師を選択</option>
        {teachers.map((t) => (
          <option key={t.id} value={t.id}>
            {t.name || t.email}
          </option>
        ))}
      </select>

      {/* カレンダー複数選択 */}
      <div className="border p-3 rounded">
        <Calendar onClickDay={onClickDay} />

        <p className="mt-2 text-sm">
          選択中: {dates.length}日
        </p>
      </div>

      {/* 時間 */}
      <input
        type="time"
        className="border p-2 w-full"
        value={startTime}
        onChange={(e) => setStartTime(e.target.value)}
      />

      <input
        type="number"
        className="border p-2 w-full"
        value={hours}
        onChange={(e) => setHours(Number(e.target.value))}
      />

      <button
        onClick={createLessons}
        className="bg-blue-600 text-white px-4 py-2 w-full"
      >
        授業作成
      </button>

      {/* 一覧 */}
      <div className="space-y-2">
        <h2 className="font-bold">授業一覧</h2>

        {lessons.map((l) => (
          <div
            key={l.id}
            className="border p-3 flex justify-between"
          >
            <div>
              <p>{l.date}</p>
              <p>{l.start_time} / {l.hours}h</p>
            </div>

            <button
              onClick={() => deleteLesson(l.id)}
              className="bg-red-500 text-white px-3 py-1"
            >
              削除
            </button>
          </div>
        ))}
      </div>

    </main>
  );
}