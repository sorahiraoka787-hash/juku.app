"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useParams, useRouter } from "next/navigation";

type Report = {
  id: number;
  lesson_id: number;
  report_text: string;
};

export default function ReportPage() {
  const { id } = useParams(); // lesson_id
  const router = useRouter();

  const [report, setReport] = useState<Report | null>(null);
  const [text, setText] = useState("");

  useEffect(() => {
    const fetchReport = async () => {
      const { data } = await supabase
        .from("lesson_reports")
        .select("*")
        .eq("lesson_id", id)
        .single();

      if (data) {
        setReport(data);
        setText(data.report_text);
      }
    };

    fetchReport();
  }, [id]);

  const save = async () => {
    const { data: user } = await supabase.auth.getUser();

    if (report) {
      // ✏️ 編集
      await supabase
        .from("lesson_reports")
        .update({
          report_text: text,
        })
        .eq("id", report.id);
    } else {
      // 🆕 新規
      await supabase.from("lesson_reports").insert([
        {
          lesson_id: Number(id),
          teacher_id: user.user?.id,
          report_text: text,
          date: new Date().toISOString().split("T")[0],
        },
      ]);
    }

    alert("保存完了");
    router.push("/teacher/missing");
  };

  return (
    <main className="p-6 space-y-4">

      <h1 className="text-xl font-bold">
        {report ? "授業報告編集" : "授業報告作成"}
      </h1>

      <textarea
        className="border p-2 w-full h-40"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="授業内容"
      />

      <button
        onClick={save}
        className="bg-blue-600 text-white px-4 py-2 w-full"
      >
        {report ? "更新する" : "提出する"}
      </button>

    </main>
  );
}