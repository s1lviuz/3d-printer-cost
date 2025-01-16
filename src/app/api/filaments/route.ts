import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getServerSession } from "next-auth/next"
import { authOptions } from '../auth/[...nextauth]/route'
import { filamentSchema } from '@/schemas/filament'

const prisma = new PrismaClient()

export async function GET(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session || !session.user) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  const filaments = await prisma.filament.findMany({
    where: { userId: session.user.id },
    orderBy: { name: 'asc', material: 'asc', color: 'asc' },
  })
  return NextResponse.json(filaments)
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session || !session.user) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  const body = await request.json()

  if (!filamentSchema.safeParse(body)) {
    const errors = filamentSchema.safeParse(body).error?.errors.map((error) => error)

    return NextResponse.json({ error: errors }, { status: 400 })
  }

  const filament = await prisma.filament.create({
    data: {
      name: body.name,
      color: body.color,
      material: body.material,
      cost: body.cost,
      userId: session.user.id,
    },
  })
  return NextResponse.json(filament)
}

export async function PUT(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session || !session.user) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  const body = await request.json()

  if (!filamentSchema.safeParse(body)) {
    const errors = filamentSchema.safeParse(body).error?.errors.map((error) => error)

    return NextResponse.json({ error: errors }, { status: 400 })
  }

  const filament = await prisma.filament.update({
    where: { id: body.id },
    data: {
      name: body.name,
      color: body.color,
      material: body.material,
      cost: body.cost,
    },
  })
  return NextResponse.json(filament)
}

export async function DELETE(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session || !session.user) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  const body = await request.json()

  if (!filamentSchema.safeParse(body)) {
    const errors = filamentSchema.safeParse(body).error?.errors.map((error) => error)

    return NextResponse.json({ error: errors }, { status: 400 })
  }

  const filament = await prisma.filament.delete({
    where: { id: body.id },
  })
  return NextResponse.json(filament)
}