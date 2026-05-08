"use client";

import Link from "next/link";

export default function AdminPage() {
  return (
    <main className="p-6 space-y-6">

      <h1 className="text-2xl font-bold">
        管理ダッシュボード
      </h1>

      <div className="grid gap-4">

        {/* 授業作成 */}
        <Link
          href="/admin/lessons"
          className="border p-4 rounded hover:bg-gray-100 transition"
        >
          📚 授業作成
        </Link>

        {/* 未報告・集計 */}
        <Link
          href="/admin/dashboard"
          className="border p-4 rounded hover:bg-gray-100 transition"
        >
          📊 未報告・集計
        </Link>

      </div>

    </main>
  );
}