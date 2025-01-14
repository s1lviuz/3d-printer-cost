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

  const regionCosts = await prisma.regionCost.findMany({
    where: { userId: session.user.id }
  })
  return NextResponse.json(regionCosts)
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session || !session.user) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  const body = await request.json()
  const regionCost = await prisma.regionCost.create({
    data: {
      name: body.name,
      kwhCost: body.kwhCost,
      userId: session.user.id,
    },
  })
  return NextResponse.json(regionCost)
}

export async function PUT(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session || !session.user) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  const body = await request.json()
  const regionCost = await prisma.regionCost.update({
    where: { id: body.id },
    data: {
      name: body.name,
      kwhCost: body.kwhCost,
    },
  })
  return NextResponse.json(regionCost)
}