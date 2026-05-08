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
  lesson_id: number;
  teacher_id: string;
  date: string;
};

type Profile = {
  id: string;
  name: string;
  email: string;
};

export default function AdminDashboard() {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [selectedTeacher, setSelectedTeacher] = useState("all");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const [{ data: l }, { data: r }, { data: p }] = await Promise.all([
      supabase.from("lessons").select("*"),
      supabase.from("lesson_reports").select("*"),
      supabase.from("profiles").select("*"),
    ]);

    setLessons(l || []);
    setReports(r || []);
    setProfiles(p || []);
  };

  // ----------------------------
  // フィルタ（講師）
  // ----------------------------
  const filteredLessons = useMemo(() => {
    if (selectedTeacher === "all") return lessons;
    return lessons.filter((l) => l.teacher_id === selectedTeacher);
  }, [lessons, selectedTeacher]);

  const filteredReports = useMemo(() => {
    if (selectedTeacher === "all") return reports;
    return reports.filter((r) => r.teacher_id === selectedTeacher);
  }, [reports, selectedTeacher]);

  // ----------------------------
  // 未報告判定
  // ----------------------------
  const reportSet = useMemo(() => {
    return new Set(filteredReports.map((r) => r.lesson_id));
  }, [filteredReports]);

  const missing = useMemo(() => {
    return filteredLessons.filter((l) => !reportSet.has(l.id));
  }, [filteredLessons, reportSet]);

  // ----------------------------
  // 今日
  // ----------------------------
  const today = new Date().toISOString().split("T")[0];

  const todayLessons = useMemo(() => {
    return filteredLessons.filter((l) => l.date === today);
  }, [filteredLessons]);

  // ----------------------------
  // 名前取得
  // ----------------------------
  const getName = (id: string) => {
    return profiles.find((p) => p.id === id)?.name || "不明";
  };

  // ----------------------------
  // カレンダー状態判定
  // ----------------------------
  const getStatus = (date: string) => {
    const dayLessons = filteredLessons.filter((l) => l.date === date);
    const dayReports = filteredReports.filter((r) => r.date === date);

    if (dayLessons.length > 0 && dayReports.length > 0) return "both";
    if (dayLessons.length > 0) return "lesson";
    if (dayReports.length > 0) return "report";
    return "none";
  };

  return (
    <main className="p-6 space-y-6">

      <h1 className="text-2xl font-bold">
        管理ダッシュボード
      </h1>

      {/* -------------------- */}
      {/* 講師フィルタ */}
      {/* -------------------- */}
      <select
        className="border p-2 rounded"
        value={selectedTeacher}
        onChange={(e) => setSelectedTeacher(e.target.value)}
      >
        <option value="all">全講師</option>
        {profiles.map((p) => (
          <option key={p.id} value={p.id}>
            {p.name}
          </option>
        ))}
      </select>

      {/* -------------------- */}
      {/* KPI */}
      {/* -------------------- */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

        <div className="border p-4 rounded">
          <p className="text-sm">未報告</p>
          <p className="text-2xl font-bold text-red-500">
            {missing.length}
          </p>
        </div>

        <div className="border p-4 rounded">
          <p className="text-sm">今日の授業</p>
          <p className="text-2xl font-bold">
            {todayLessons.length}
          </p>
        </div>

        <div className="border p-4 rounded">
          <p className="text-sm">報告済み</p>
          <p className="text-2xl font-bold text-green-500">
            {filteredReports.length}
          </p>
        </div>

        <div className="border p-4 rounded">
          <p className="text-sm">総授業数</p>
          <p className="text-2xl font-bold">
            {filteredLessons.length}
          </p>
        </div>

      </div>

      {/* -------------------- */}
      {/* カレンダー */}
      {/* -------------------- */}
      <div className="border p-4 rounded">

        <Calendar
          tileClassName={({ date }) => {
            const d = date.toISOString().split("T")[0];
            const status = getStatus(d);

            if (status === "both") return "bg-purple-400 text-white";
            if (status === "lesson") return "bg-blue-400 text-white";
            if (status === "report") return "bg-green-400 text-white";

            return "";
          }}
        />

      </div>

      {/* -------------------- */}
      {/* 未報告一覧 */}
      {/* -------------------- */}
      <div className="border p-4 rounded">

        <h2 className="font-bold mb-2">
          未報告一覧
        </h2>

        {missing.length === 0 ? (
          <p className="text-green-600 font-bold">
            未報告はありません
          </p>
        ) : (
          missing.slice(0, 10).map((l) => (
            <div
              key={l.id}
              className="flex justify-between border-b py-2 text-sm"
            >
              <span>{l.date}</span>
              <span>{getName(l.teacher_id)}</span>
            </div>
          ))
        )}

      </div>

    </main>
  );
}