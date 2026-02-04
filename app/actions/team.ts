'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { unstable_noStore as noStore } from 'next/cache'

export async function getTeamMembers() {
  noStore()
  try {
    const teamMembers = await prisma.teamMember.findMany({
      orderBy: { order: 'asc' }
    })

    const sortedMembers = [...teamMembers].sort((a, b) => {
      const typeOrder: Record<string, number> = {
        LITBANG: 0,
        DIVISI: 1,
        DEPARTEMEN: 2
      }
      const orderA = typeOrder[a.type as string] ?? 99
      const orderB = typeOrder[b.type as string] ?? 99
      
      if (orderA !== orderB) return orderA - orderB
      return a.order - b.order
    })

    return { success: true, data: sortedMembers }
  } catch (error) {
    console.error('Error fetching team members:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Failed to fetch team members' }
  }
}

export async function createTeamMember(data: any) {
  try {
    const teamMember = await prisma.teamMember.create({ data })
    revalidatePath('/')
    revalidatePath('/admin')
    return { success: true, data: teamMember }
  } catch (error) {
    console.error('Error creating team member:', error)
    return { success: false, error: 'Failed to create team member' }
  }
}

export async function updateTeamMember(id: string, data: any) {
  try {
    const teamMember = await prisma.teamMember.update({
      where: { id },
      data
    })
    revalidatePath('/')
    revalidatePath('/admin')
    return { success: true, data: teamMember }
  } catch (error) {
    console.error('Error updating team member:', error)
    return { success: false, error: 'Failed to update team member' }
  }
}

export async function deleteTeamMember(id: string) {
  try {
    await prisma.teamMember.delete({
      where: { id }
    })
    revalidatePath('/')
    revalidatePath('/admin')
    return { success: true }
  } catch (error) {
    console.error('Error deleting team member:', error)
    return { success: false, error: 'Failed to delete team member' }
  }
}
