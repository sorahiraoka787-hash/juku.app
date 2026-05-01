"use client";

import Link from "next/link";

export default function AdminPage() {
  return (
    <main className="p-6 space-y-6">

      <h1 className="text-2xl font-bold">
        管理ダッシュボード
      </h1>

      <div className="grid gap-4">

        <Link
          href="/admin/shifts"
          className="border p-4 rounded hover:bg-gray-50"
        >
          📅 シフト管理
        </Link>

        <Link
          href="/admin/payroll"
          className="border p-4 rounded hover:bg-gray-50"
        >
          💰 給与管理
        </Link>

        <Link
          href="/admin/teachers"
          className="border p-4 rounded hover:bg-gray-50"
        >
          👨‍🏫 講師一覧
        </Link>

        <Link
          href="/admin/attendance"
          className="border p-4 rounded hover:bg-gray-50"
        >
          ⏱ 勤怠確認
        </Link>

      </div>

    </main>
  );
}