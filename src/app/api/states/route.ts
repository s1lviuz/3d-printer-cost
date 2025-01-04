import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getServerSession } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]/route'

const prisma = new PrismaClient()

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session || !session.user) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  const states = await prisma.regionCost.findMany()
  return NextResponse.json(states)
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session || !session.user) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  const body = await request.json()
  const state = await prisma.regionCost.create({
    data: {
      name: body.name,
      kwhCost: body.kwhCost,
      userId: session.user.id,
    },
  })
  return NextResponse.json(state)
}

