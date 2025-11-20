import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const teamMembers = await prisma.teamMember.findMany({
      orderBy: { order: 'asc' }
    })
    return NextResponse.json(teamMembers)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch team members' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()
    const teamMember = await prisma.teamMember.create({ data })
    return NextResponse.json(teamMember)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create team member' }, { status: 500 })
  }
}
