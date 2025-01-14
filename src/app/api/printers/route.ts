import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getServerSession } from "next-auth/next"
import { authOptions } from '../auth/[...nextauth]/route'

const prisma = new PrismaClient()

export async function GET(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session || !session.user) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  const printers = await prisma.printer.findMany({
    where: { userId: session.user.id }
  })
  return NextResponse.json(printers)
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session || !session.user) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  const body = await request.json()
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
  const printer = await prisma.printer.update({
    where: { id: body.id },
    data: {
      name: body.name,
      wattage: body.wattage,
    },
  })
  return NextResponse.json(printer)
}