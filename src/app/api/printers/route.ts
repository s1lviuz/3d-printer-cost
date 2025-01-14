import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getServerSession } from "next-auth/next"
import { authOptions } from '../auth/[...nextauth]/route'
import { printerSchema } from '@/schemas/printer'

const prisma = new PrismaClient()

export async function GET(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session || !session.user) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  const printers = await prisma.printer.findMany({
    where: { userId: session.user.id },
    orderBy: { name: 'asc' },
  })
  return NextResponse.json(printers)
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session || !session.user) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  const body = await request.json()

  if (!printerSchema.safeParse(body)) {
    const errors = printerSchema.safeParse(body).error?.errors.map((error) => error)

    return NextResponse.json({ error: errors }, { status: 400 })
  }

  const printer = await prisma.printer.create({
    data: {
      name: body.name,
      wattage: body.wattage,
      userId: session.user.id,
    },
  })
  return NextResponse.json(printer)
}

export async function PUT(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session || !session.user) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  const body = await request.json()

  if (!printerSchema.safeParse(body)) {
    const errors = printerSchema.safeParse(body).error?.errors.map((error) => error)

    return NextResponse.json({ error: errors }, { status: 400 })
  }

  const printer = await prisma.printer.update({
    where: { id: body.id },
    data: {
      name: body.name,
      wattage: body.wattage,
    },
  })
  return NextResponse.json(printer)
}

export async function DELETE(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session || !session.user) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  const body = await request.json()
  const printerId = body.id

  await prisma.printer.delete({
    where: { id: printerId }
  })
  return NextResponse.json({ success: true })
}