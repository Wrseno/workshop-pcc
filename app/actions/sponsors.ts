'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function getSponsors() {
  try {
    const sponsors = await prisma.sponsor.findMany({
      orderBy: { order: 'asc' }
    })
    return { success: true, data: sponsors }
  } catch (error) {
    console.error('Error fetching sponsors:', error)
    return { success: false, error: 'Failed to fetch sponsors' }
  }
}

export async function createSponsor(data: any) {
  try {
    const sponsor = await prisma.sponsor.create({ data })
    revalidatePath('/')
    revalidatePath('/admin')
    return { success: true, data: sponsor }
  } catch (error) {
    console.error('Error creating sponsor:', error)
    return { success: false, error: 'Failed to create sponsor' }
  }
}

export async function updateSponsor(id: string, data: any) {
  try {
    const sponsor = await prisma.sponsor.update({
      where: { id },
      data
    })
    revalidatePath('/')
    revalidatePath('/admin')
    return { success: true, data: sponsor }
  } catch (error) {
    console.error('Error updating sponsor:', error)
    return { success: false, error: 'Failed to update sponsor' }
  }
}

export async function deleteSponsor(id: string) {
  try {
    await prisma.sponsor.delete({
      where: { id }
    })
    revalidatePath('/')
    revalidatePath('/admin')
    return { success: true }
  } catch (error) {
    console.error('Error deleting sponsor:', error)
    return { success: false, error: 'Failed to delete sponsor' }
  }
}
