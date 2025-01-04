import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  const printerFilaments = await prisma.printerFilament.findMany({
    include: {
      printer: true,
      filament: true,
    },
  })
  return NextResponse.json(printerFilaments)
}

export async function POST(request: Request) {
  const body = await request.json()
  const printerFilament = await prisma.printerFilament.create({
    data: {
      printerId: body.printerId,
      filamentId: body.filamentId,
      stock: body.stock,
    },
    include: {
      printer: true,
      filament: true,
    },
  })
  return NextResponse.json(printerFilament)
}

