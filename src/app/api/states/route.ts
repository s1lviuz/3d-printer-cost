import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  const states = await prisma.state.findMany()
  return NextResponse.json(states)
}

export async function POST(request: Request) {
  const body = await request.json()
  const state = await prisma.state.create({
    data: {
      name: body.name,
      kwhCost: body.kwhCost,
    },
  })
  return NextResponse.json(state)
}

