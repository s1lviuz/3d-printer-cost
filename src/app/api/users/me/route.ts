import { NextResponse } from 'next/server'
import { Prisma, PrismaClient } from '@prisma/client'
import { getServerSession } from "next-auth/next"
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

export const UserPayload = {
    select: {
        email: true,
        name: true,
        image: true,
        accounts: {
            select: {
                provider: true
            }
        },
        _count: {
            select: {
                printers: true,
                filaments: true,
                regionCosts: true
            }
        }
    }
} satisfies Omit<Prisma.UserFindUniqueArgs, 'where'>

const prisma = new PrismaClient()

export async function GET(request: Request) {
    const session = await getServerSession(authOptions)
    if (!session || !session.user) {
        return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
        select: UserPayload.select,
        where: { id: session.user.id },
    })
    return NextResponse.json(user)
}

export async function DELETE(request: Request) {
    const session = await getServerSession(authOptions)
    if (!session || !session.user) {
        return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    await prisma.user.delete({
        where: { id: session.user.id }
    })
    return NextResponse.json({ success: true })
}