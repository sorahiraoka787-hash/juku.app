"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Ann = {
  id: string;
  title: string;
  content: string;
  created_at: string;
};

export default function TeacherAnnouncementPage() {
  const [announcements, setAnnouncements] = useState<Ann[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const { data, error } = await supabase
      .from("announcements")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      return;
    }

    setAnnouncements(data || []);
  };

  return (
    <main className="p-6 space-y-6">

      <h1 className="text-2xl font-bold">
        お知らせ
      </h1>

      <div className="space-y-4">

        {announcements.map((a) => (
          <div
            key={a.id}
            className="border p-4 rounded"
          >

            <p className="text-sm text-gray-500">
              {new Date(a.created_at).toLocaleDateString()}
            </p>

            <h2 className="font-bold text-lg">
              {a.title}
            </h2>

            <p className="mt-2 whitespace-pre-wrap">
              {a.content}
            </p>

          </div>
        ))}

      </div>

    </main>
  );
}