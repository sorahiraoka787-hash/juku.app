"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Material = {
  id: string;
  title: string;
  subject: string;
  url: string;
};

export default function TeacherMaterialsPage() {
  const [materials, setMaterials] = useState<Material[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const { data, error } = await supabase
      .from("materials")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      return;
    }

    setMaterials(data || []);
  };

  return (
    <main className="p-6 space-y-6">

      <h1 className="text-2xl font-bold">
        教材一覧
      </h1>

      <div className="space-y-4">

        {materials.map((m) => (
          <a
            key={m.id}
            href={m.url}
            target="_blank"
            className="block border p-4 rounded hover:bg-gray-50"
          >

            <p className="text-sm text-gray-500">
              {m.subject}
            </p>

            <p className="font-bold">
              {m.title}
            </p>

          </a>
        ))}

      </div>

    </main>
  );
}