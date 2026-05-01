"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function PayrollPage() {
  const [result, setResult] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    calc();
  }, []);

  const calc = async () => {
    try {
      setLoading(true);

      // 勤務データ
      const { data: works, error: worksError } = await supabase
        .from("work_record") // ← テーブル名ここ重要
        .select("*");

      // 講師データ
      const { data: teachers, error: teachersError } = await supabase
        .from("teachers")
        .select("*");

      if (worksError || teachersError) {
        console.error(worksError || teachersError);
        setLoading(false);
        return;
      }

      if (!works || !teachers) {
        setLoading(false);
        return;
      }

      const month = new Date().toISOString().slice(0, 7);

      const monthly = works.filter((w) =>
        w.date?.startsWith(month)
      );

      const res = teachers.map((t) => {
        const myWorks = monthly.filter(
          (w) => w.email === t.email
        );

        const totalHours = myWorks.reduce((sum, w) => {
          if (!w.startTime || !w.endTime) return sum;

          const [sh, sm] = w.startTime.split(":").map(Number);
          const [eh, em] = w.endTime.split(":").map(Number);

          return sum + (eh + em / 60 - (sh + sm / 60));
        }, 0);

        return {
          email: t.email,
          hours: totalHours,
          salary: totalHours * (t.hourlyWage || 0),
        };
      });

      setResult(res);

    } catch (e) {
      console.error("error:", e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="p-6 space-y-6">

      <h1 className="text-2xl font-bold">
        今月の給与
      </h1>

      {loading && (
        <p>読み込み中...</p>
      )}

      {!loading && (
        <div className="space-y-3">

          {result.map((r, i) => (
            <div key={i} className="border p-3 rounded">

              <p className="font-bold">{r.email}</p>

              <p>勤務時間：{r.hours.toFixed(2)}h</p>

              <p className="text-green-600 font-bold">
                給与：¥{r.salary.toLocaleString()}
              </p>

            </div>
          ))}

        </div>
      )}

    </main>
  );
}