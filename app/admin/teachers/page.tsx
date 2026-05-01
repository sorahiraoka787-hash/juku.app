"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Teacher = {
  name: string | null;
  hourlyWage: number | null;
};

export default function TestTeachers() {
  const [data, setData] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        setLoading(true);

        const { data, error } = await supabase
          .from("teachers")
          .select("*");

        if (error) {
          console.error(error);
          setError("データ取得エラー");
          return;
        }

        setData(data || []);

      } catch (e) {
        console.error("unexpected error:", e);
        setError("予期しないエラー");
      } finally {
        setLoading(false);
      }
    };

    fetchTeachers();
  }, []);

  return (
    <div className="p-6">

      <h1 className="text-xl font-bold">
        Teachers Test
      </h1>

      {loading && <p>読み込み中...</p>}

      {error && (
        <p className="text-red-500">{error}</p>
      )}

      {!loading && !error && (
        <div className="space-y-2 mt-4">

          {data.length === 0 && (
            <p>データなし</p>
          )}

          {data.map((t, i) => (
            <div key={i} className="border p-2 rounded">

              {t.name ?? "名前なし"} /{" "}
              {t.hourlyWage ?? 0}

            </div>
          ))}

        </div>
      )}

    </div>
  );
}