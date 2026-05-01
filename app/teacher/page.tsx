"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function TeacherPage() {
  const [email, setEmail] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      setEmail(user?.email || "");
    };

    fetchUser();
  }, []);

  return (
    <main className="p-6 space-y-6">

      <h1 className="text-2xl font-bold">
        おかえり {email.split("@")[0]}
      </h1>

      <div className="grid gap-4">

        <Link
          href="/teacher/attendance"
          className="border p-4 rounded hover:bg-gray-50"
        >
          ⏱ 勤怠入力
        </Link>

        <Link
          href="/teacher/shifts"
          className="border p-4 rounded hover:bg-gray-50"
        >
          📅 シフト確認
        </Link>

        <Link
          href="/teacher/payroll"
          className="border p-4 rounded hover:bg-gray-50"
        >
          💰 給与確認
        </Link>

      </div>

    </main>
  );
}