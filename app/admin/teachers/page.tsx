"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function TestTeachers() {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    const fetch = async () => {
      const { data, error } = await supabase
        .from("teachers")
        .select("*");

      console.log("data:", data);
      console.log("error:", error);

      setData(data || []);
    };

    fetch();
  }, []);

  return (
    <div className="p-6">
      <h1>Teachers Test</h1>

      {data.map((t, i) => (
        <div key={i}>
          {t.name} / {t.hourlyWage}
        </div>
      ))}
    </div>
  );
}