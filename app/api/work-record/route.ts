import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  const { data, error } = await supabase
    .from("work_record")
    .select("*")
    .order("id", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    records: data,
  });
}

export async function POST(req: Request) {
  const body = await req.json();

  const { error } = await supabase.from("work_record").insert({
    teacher: body.teacher,
    date: body.date,
    startTime: body.startTime,
    endTime: body.endTime,
    subject: body.subject,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}