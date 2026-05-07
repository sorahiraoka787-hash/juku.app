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
      .select("id, email, date, start_time, hours")
      .order("date", { ascending: false });

    if (error) {
      console.error(error);
      return;
    }

    setRecords(data || []);
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

  // 日付ごと
  const grouped = records.reduce((acc: any, cur) => {
    if (!acc[cur.date]) acc[cur.date] = [];

    acc[cur.date].push(cur);

    return acc;
  }, {});

  // ユーザー別合計
  const totalHoursByUser = records.reduce(
    (acc: any, cur) => {
      const name = cur.email.split("@")[0];

      if (!acc[name]) {
        acc[name] = 0;
      }

      acc[name] += cur.hours;

      return acc;
    },
    {}
  );

  // 日別合計
  const totalHoursByDate = records.reduce(
    (acc: any, cur) => {
      if (!acc[cur.date]) {
        acc[cur.date] = 0;
      }

      acc[cur.date] += cur.hours;

      return acc;
    },
    {}
  );

  return (
    <main className="p-6 space-y-6">

      <h1 className="text-2xl font-bold">
        勤怠管理（admin）
      </h1>

      {/* ユーザー別合計 */}
      <div className="border rounded p-4">

        <h2 className="text-xl font-bold mb-4">
          ユーザー別合計勤務時間
        </h2>

        <div className="space-y-2">

          {Object.entries(totalHoursByUser).map(
            ([name, total]) => (
              <div
                key={name}
                className="flex justify-between border rounded p-2"
              >

                <p className="font-bold">
                  {name}
                </p>

                <p>
                  {Number(total)}時間
                </p>

              </div>
            )
          )}

        </div>

      </div>

      {/* 日別合計 */}
      <div className="border rounded p-4">

        <h2 className="text-xl font-bold mb-4">
          日別合計勤務時間
        </h2>

        <div className="space-y-2">

          {Object.entries(totalHoursByDate)
            .sort((a: any, b: any) => (a[0] < b[0] ? 1 : -1))
            .map(([date, total]) => (
              <div
                key={String(date)}
                className="flex justify-between border rounded p-2"
              >

                <p className="font-bold">
                  {String(date)}
                </p>

                <p>
                  {Number(total)}時間
                </p>

              </div>
            ))}

        </div>

      </div>

      {/* 勤怠一覧 */}
      <div className="space-y-6">

        {Object.keys(grouped)
          .sort((a, b) => (a < b ? 1 : -1))
          .map((date) => (
            <div
              key={date}
              className="border rounded p-4"
            >

              {/* 日付 */}
              <div className="flex justify-between mb-4">

                <h2 className="font-bold text-lg">
                  {date}
                </h2>

                <p className="font-bold text-blue-600">
                  合計 {totalHoursByDate[date]}時間
                </p>

              </div>

              {/* レコード */}
              <div className="space-y-2">

                {grouped[date].map((r: RecordItem) => (
                  <div
                    key={r.id}
                    className="flex justify-between border p-3 rounded items-center"
                  >

                    <div>

                      <p className="font-bold">
                        {r.email.split("@")[0]}
                      </p>

                      <p className="text-sm text-gray-500">
                        {r.start_time} / {r.hours}時間
                      </p>

                    </div>

                    <div className="flex gap-2 items-center">

                      <div className="text-green-600 font-bold">
                        入力済
                      </div>

                      <button
                        onClick={() => deleteRecord(r.id)}
                        className="bg-red-500 text-white px-3 py-1 rounded"
                      >
                        削除
                      </button>

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