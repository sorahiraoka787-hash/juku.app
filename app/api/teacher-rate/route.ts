import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const data =
    await prisma.teacherRate.findMany();

  return NextResponse.json({
    rates: data,
  });
}

export async function POST(req: Request) {
  const body = await req.json();

  await prisma.teacherRate.upsert({
    where: {
      teacher: body.teacher,
    },
    update: {
      rate: body.rate,
    },
    create: {
      teacher: body.teacher,
      rate: body.rate,
    },
  });

  return NextResponse.json({ ok: true });
}