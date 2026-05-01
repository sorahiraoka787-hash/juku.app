"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function AdminMaterialsPage() {
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [url, setUrl] = useState("");

  const submit = async () => {
    if (!title || !subject || !url) return;

    const { error } = await supabase.from("materials").insert([
      {
        title,
        subject,
        url,
      },
    ]);

    if (error) {
      console.error(error);
      alert("投稿失敗");
      return;
    }

    alert("教材追加完了");

    setTitle("");
    setSubject("");
    setUrl("");
  };

  return (
    <main className="p-6 space-y-4">

      <h1 className="text-2xl font-bold">
        教材管理（admin）
      </h1>

      <input
        className="border p-2 w-full"
        placeholder="タイトル"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <input
        className="border p-2 w-full"
        placeholder="科目（例：中3数学）"
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
      />

      <input
        className="border p-2 w-full"
        placeholder="URL（PDF / Drive / YouTube）"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      />

      <button
        onClick={submit}
        className="bg-blue-600 text-white px-4 py-2 w-full"
      >
        追加
      </button>

    </main>
  );
}