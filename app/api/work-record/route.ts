import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const data =
    await prisma.workRecord.findMany({
      orderBy: {
        id: "desc",
      },
    });

  return NextResponse.json({
    records: data,
  });
}

export async function POST(req: Request) {
  const body = await req.json();

  await prisma.workRecord.create({
    data: {
      teacher: body.teacher,
      date: body.date,
      startTime: body.startTime,
      endTime: body.endTime,
      subject: body.subject,
    },
  });

  return NextResponse.json({ ok: true });
}