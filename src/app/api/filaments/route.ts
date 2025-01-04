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

  const filaments = await prisma.filament.findMany({
    where: { userId: session.user.id }
  })
  return NextResponse.json(filaments)
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session || !session.user) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  const body = await request.json()
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

