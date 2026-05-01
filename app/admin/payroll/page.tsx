"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function PayrollPage() {
  const [result, setResult] = useState<any[]>([]);

  useEffect(() => {
    calc();
  }, []);

  const calc = async () => {
    const { data: works } = await supabase.from("work-record").select("*");
    const { data: teachers } = await supabase.from("teachers").select("*");

    if (!works || !teachers) return;

    const month = new Date().toISOString().slice(0, 7);

    const monthly = works.filter((w) =>
      w.date.startsWith(month)
    );

    const res = teachers.map((t) => {
      const myWorks = monthly.filter(
        (w) => w.email === t.email
      );

      const totalHours = myWorks.reduce((sum, w) => {
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
  };

  return (
    <main className="p-6 space-y-6">

      <h1 className="text-2xl font-bold">
        今月の給与
      </h1>

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

    </main>
  );
}