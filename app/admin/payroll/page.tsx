"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Teacher = {
  id: string;
  email: string;
  hourlyWage: number;
};

type WorkRecord = {
  email: string;
  date: string;
  hours: number;
};

type SalaryRow = {
  email: string;
  hours: number;
  salary: number;
};

export default function PayrollPage() {
  const [result, setResult] = useState<SalaryRow[]>([]);
  const [month, setMonth] = useState("");

  useEffect(() => {
    const now = new Date();
    setMonth(now.toISOString().slice(0, 7));
  }, []);

  useEffect(() => {
    if (month) calc();
  }, [month]);

  const calc = async () => {
    const { data: teachers } = await supabase
      .from("teachers")
      .select("*");

    const { data: works } = await supabase
      .from("work_records")
      .select("*");

    if (!teachers || !works) return;

    // 今月データだけ抽出
    const monthly = (works as WorkRecord[]).filter((w) =>
      w.date.startsWith(month)
    );

    const res: SalaryRow[] = (teachers as Teacher[]).map((t) => {
      const myWork = monthly.filter((w) => w.email === t.email);

      const totalHours = myWork.reduce(
        (sum, w) => sum + (w.hours || 0),
        0
      );

      return {
        email: t.email,
        hours: totalHours,
        salary: totalHours * (t.hourlyWage || 0),
      };
    });

    setResult(res);
  };

  return (
    <main className="p-6 space-y-6">

      <h1 className="text-2xl font-bold">
        給与管理
      </h1>

      {/* 月選択 */}
      <input
        type="month"
        value={month}
        onChange={(e) => setMonth(e.target.value)}
        className="border p-2"
      />

      {/* 結果 */}
      <div className="space-y-3 mt-4">

        {result.map((r) => (
          <div
            key={r.email}
            className="border p-4 rounded flex justify-between"
          >

            <div>
              <p className="font-bold">
                {r.email.split("@")[0]}
              </p>

              <p className="text-sm text-gray-500">
                勤務：{r.hours.toFixed(1)}h
              </p>
            </div>

            <div className="text-green-600 font-bold text-lg">
              ¥{r.salary.toLocaleString()}
            </div>

          </div>
        ))}

      </div>

    </main>
  );
}