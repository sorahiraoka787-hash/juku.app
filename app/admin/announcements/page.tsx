"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function AdminAnnouncementPage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const submit = async () => {
    if (!title || !content) return;

    const { error } = await supabase
      .from("announcements")
      .insert([
        {
          title,
          content,
        },
      ]);

    if (error) {
      console.error(error);
      alert("投稿失敗");
      return;
    }

    alert("投稿完了");

    setTitle("");
    setContent("");
  };

  return (
    <main className="p-6 space-y-4">

      <h1 className="text-2xl font-bold">
        お知らせ投稿（admin）
      </h1>

      <input
        className="border p-2 w-full"
        placeholder="タイトル"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <textarea
        className="border p-2 w-full h-40"
        placeholder="内容"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />

      <button
        onClick={submit}
        className="bg-blue-600 text-white px-4 py-2 w-full"
      >
        投稿
      </button>

    </main>
  );
}