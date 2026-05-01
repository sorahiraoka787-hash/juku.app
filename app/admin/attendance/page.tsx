"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type RecordItem = {
  id: string;
  email: string;
  date: string;
  start_time: string;
  hours: number;
};

export default function AdminAttendancePage() {
  const [records, setRecords] = useState<RecordItem[]>([]);

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    const { data, error } = await supabase
      .from("work_records")
      .select("*")
      .order("date", { ascending: false });

    if (error) {
      console.error(error);
      return;
    }

    setRecords(data || []);
  };

  const grouped = records.reduce((acc: any, cur) => {
    if (!acc[cur.date]) acc[cur.date] = [];
    acc[cur.date].push(cur);
    return acc;
  }, {});

  return (
    <main className="p-6 space-y-6">

      <h1 className="text-2xl font-bold">
        勤怠管理（admin）
      </h1>

      <div className="space-y-6">

        {Object.keys(grouped)
          .sort((a, b) => (a < b ? 1 : -1))
          .map((date) => (
            <div key={date} className="border rounded p-4">

              {/* 日付 */}
              <h2 className="font-bold text-lg mb-2">
                {date}
              </h2>

              {/* レコード */}
              <div className="space-y-2">

                {grouped[date].map((r: RecordItem) => (
                  <div
                    key={r.id}
                    className="flex justify-between border p-2 rounded"
                  >

                    <div>
                      <p className="font-bold">
                        {r.email.split("@")[0]}
                      </p>

                      <p className="text-sm text-gray-500">
                        {r.start_time} / {r.hours}h
                      </p>
                    </div>

                    {/* 状態（とりあえず全て入力済み扱い） */}
                    <div className="text-green-600 font-bold">
                      入力済
                    </div>

                  </div>
                ))}

              </div>

            </div>
          ))}

      </div>

    </main>
  );
}