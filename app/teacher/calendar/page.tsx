"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

type Lesson = {
  id: number;
  teacher_id: string;
  date: string;
};

type Report = {
  id: number;
  teacher_id: string;
  lesson_id: number;
  date: string;
};

export default function TeacherCalendar() {
  const [userId, setUserId] = useState("");
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [reports, setReports] = useState<Report[]>([]);

  useEffect(() => {
    const init = async () => {
      const { data } = await supabase.auth.getUser();
      const id = data.user?.id || "";
      if (!id) return;

      setUserId(id);

      const [{ data: lessonData }, { data: reportData }] =
        await Promise.all([
          supabase.from("lessons").select("*").eq("teacher_id", id),
          supabase.from("lesson_reports").select("*").eq("teacher_id", id),
        ]);

      setLessons(lessonData || []);
      setReports(reportData || []);
    };

    init();
  }, []);

  const lessonSet = useMemo(
    () => new Set(lessons.map((l) => l.date)),
    [lessons]
  );

  const reportSet = useMemo(
    () => new Set(reports.map((r) => r.date)),
    [reports]
  );

  const getStatus = (date: string) => {
    const hasLesson = lessonSet.has(date);
    const hasReport = reportSet.has(date);

    if (hasLesson && hasReport) return "done";
    if (hasLesson && !hasReport) return "missing";
    return "none";
  };

  const getClass = (date: Date) => {
    const d = date.toISOString().split("T")[0];
    const status = getStatus(d);

    if (status === "done") {
      return "bg-green-500 text-white rounded-md";
    }

    if (status === "missing") {
      return "bg-red-500 text-white font-bold rounded-md";
    }

    return "";
  };

  return (
    <main className="p-6 space-y-6">

      <h1 className="text-2xl font-bold">
        授業カレンダー
      </h1>

      <div className="border rounded p-4">

        <Calendar tileClassName={({ date }) => getClass(date)} />

        {/* 凡例 */}
        <div className="flex gap-4 mt-4 text-sm">

          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-red-500" />
            未報告（要対応）
          </div>

          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-green-500" />
            報告済み
          </div>

        </div>

      </div>

    </main>
  );
}