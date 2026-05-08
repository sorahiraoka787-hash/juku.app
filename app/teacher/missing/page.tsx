"use client";

import { useEffect, useState, useMemo } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

type Lesson = {
  id: number;
  teacher_id: string;
  date: string;
  start_time: string;
  hours: number;
};

type Report = {
  id: number;
  lesson_id: number;
};

export default function MissingReportsPage() {
  const router = useRouter();

  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [reports, setReports] = useState<Report[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const [{ data: lessonData }, { data: reportData }] =
        await Promise.all([
          supabase.from("lessons").select("*"),
          supabase.from("lesson_reports").select("*"),
        ]);

      setLessons(lessonData || []);
      setReports(reportData || []);
    };

    fetchData();
  }, []);

  const reportSet = useMemo(() => {
    return new Set(reports.map((r) => r.lesson_id));
  }, [reports]);

  const missing = useMemo(() => {
    return lessons.filter((l) => !reportSet.has(l.id));
  }, [lessons, reportSet]);

  const goToReport = (lessonId: number) => {
    router.push(`/teacher/report/${lessonId}`);
  };

  return (
    <main className="p-6 space-y-4">

      <h1 className="text-2xl font-bold">
        未報告一覧
      </h1>

      {missing.map((l) => (
        <div
          key={l.id}
          onClick={() => goToReport(l.id)}
          className="border p-4 rounded cursor-pointer hover:bg-red-50 transition"
        >

          <p className="font-bold">
            {l.date}
          </p>

          <p className="text-sm text-gray-600">
            {l.start_time} / {l.hours}h
          </p>

          <p className="text-red-600 font-bold">
            未報告 → クリックして報告
          </p>

        </div>
      ))}

    </main>
  );
}