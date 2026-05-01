"use client";

import {
  useEffect,
  useState,
} from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

type RecordItem = {
  id: number;
  date: string;
  startTime: string;
  endTime: string;
  subject: string;
  teacher: string;
};

export default function TeacherPage() {
  const router = useRouter();

  const [userName, setUserName] =
    useState("");

  const [date, setDate] =
    useState("");

  const [startTime, setStartTime] =
    useState("");

  const [endTime, setEndTime] =
    useState("");

  const [subject, setSubject] =
    useState("");

  const [records, setRecords] =
    useState<RecordItem[]>([]);

  const hourly = 1200;

  const fetchUser = async () => {
    const {
      data: { session },
    } =
      await supabase.auth.getSession();

    const email =
      session?.user.email || "";

    setUserName(
      email.split("@")[0]
    );
  };

  const fetchRecords = async () => {
    const res = await fetch(
      "/api/work-record"
    );

    const data = await res.json();

    setRecords(data.records);
  };

  useEffect(() => {
    fetchUser();
    fetchRecords();
  }, []);

  const logout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  const save = async () => {
    await fetch(
      "/api/work-record",
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify({
          teacher: userName,
          date,
          startTime,
          endTime,
          subject,
        }),
      }
    );

    fetchRecords();

    setDate("");
    setStartTime("");
    setEndTime("");
    setSubject("");
  };

  const myRecords =
    records.filter(
      (r) =>
        r.teacher === userName
    );

  const calcHours = (
    start: string,
    end: string
  ) => {
    const s =
      Number(start.split(":")[0]) +
      Number(start.split(":")[1]) /
        60;

    const e =
      Number(end.split(":")[0]) +
      Number(end.split(":")[1]) /
        60;

    return e - s;
  };

  const totalHours =
    myRecords.reduce(
      (sum, r) =>
        sum +
        calcHours(
          r.startTime,
          r.endTime
        ),
      0
    );

  const salary =
    totalHours * hourly;

  return (
    <main className="min-h-screen bg-[#F6F8F7] p-8 space-y-8">
      {/* Header */}
      <div className="flex justify-between">
        <h1 className="text-3xl font-bold">
          {userName} さん
        </h1>

        <button
          onClick={logout}
          className="bg-[#1E3A8A] text-white px-5 py-2 rounded-xl"
        >
          ログアウト
        </button>
      </div>

      {/* Salary */}
      <div className="bg-white rounded-2xl shadow p-6">
        <p>今月勤務時間</p>
        <h2 className="text-2xl font-bold text-[#1E3A8A]">
          {totalHours.toFixed(1)} h
        </h2>

        <p className="mt-4">
          推定給与
        </p>

        <h2 className="text-2xl font-bold text-[#1E3A8A]">
          ¥
          {salary.toLocaleString()}
        </h2>
      </div>

      {/* Form */}
      <div className="bg-white rounded-2xl shadow p-6 space-y-4">
        <h3 className="text-xl font-bold">
          勤務実績入力
        </h3>

        <input
          type="date"
          value={date}
          onChange={(e) =>
            setDate(
              e.target.value
            )
          }
          className="w-full border rounded-xl px-4 py-3"
        />

        <input
          type="time"
          value={startTime}
          onChange={(e) =>
            setStartTime(
              e.target.value
            )
          }
          className="w-full border rounded-xl px-4 py-3"
        />

        <input
          type="time"
          value={endTime}
          onChange={(e) =>
            setEndTime(
              e.target.value
            )
          }
          className="w-full border rounded-xl px-4 py-3"
        />

        <input
          placeholder="中3数学"
          value={subject}
          onChange={(e) =>
            setSubject(
              e.target.value
            )
          }
          className="w-full border rounded-xl px-4 py-3"
        />

        <button
          onClick={save}
          className="w-full bg-[#1E3A8A] text-white py-3 rounded-xl"
        >
          保存する
        </button>
      </div>

      {/* History */}
      <div className="bg-white rounded-2xl shadow p-6">
        <h3 className="font-bold text-xl mb-4">
          履歴
        </h3>

        <div className="space-y-3">
          {myRecords.map((r) => (
            <div
              key={r.id}
              className="border rounded-xl p-4"
            >
              <p>{r.date}</p>
              <p>
                {r.startTime}〜
                {r.endTime}
              </p>
              <p>
                {r.subject}
              </p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

console.log("URL:", process.env.NEXT_PUBLIC_SUPABASE_URL);
console.log("KEY:", process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);