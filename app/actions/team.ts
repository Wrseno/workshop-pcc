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
    return { success: true, data: teamMembers }
  } catch (error) {
    console.error('Error fetching team members:', error)
    return { success: false, error: 'Failed to fetch team members' }
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
