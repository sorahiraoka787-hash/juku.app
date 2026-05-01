import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const shifts = await prisma.shift.findMany({
    orderBy: {
      id: "desc",
    },
  });

  return NextResponse.json({ shifts });
}

export async function POST(req: Request) {
  const body = await req.json();

  await prisma.shift.create({
    data: {
      date: body.date,
      teacher: body.teacher,
      time: body.time,
      subject: body.subject,
    },
  });

  return NextResponse.json({ ok: true });
}

export async function DELETE(req: Request) {
  const body = await req.json();

  await prisma.shift.delete({
    where: {
      id: body.id,
    },
  });

  return NextResponse.json({ ok: true });
}