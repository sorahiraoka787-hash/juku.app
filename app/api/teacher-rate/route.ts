import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  const { data, error } = await supabase
    .from("teacherRate")
    .select("*");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ rates: data });
}

export async function POST(req: Request) {
  const body = await req.json();

  // ① 既存チェック（Prismaのwhere）
  const { data: existing } = await supabase
    .from("teacherRate")
    .select("*")
    .eq("teacher", body.teacher)
    .single();

  if (existing) {
    // ② update
    const { error } = await supabase
      .from("teacherRate")
      .update({ rate: body.rate })
      .eq("teacher", body.teacher);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  } else {
    // ③ create
    const { error } = await supabase
      .from("teacherRate")
      .insert({
        teacher: body.teacher,
        rate: body.rate,
      });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }

  return NextResponse.json({ ok: true });
}
