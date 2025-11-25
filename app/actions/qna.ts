'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function getQnaItems(mode?: string | null) {
  try {
    const qnaItems = await prisma.qnaItem.findMany({
      where: mode ? {
        OR: [
          { mode: null },
          { mode: mode as any }
        ]
      } : undefined,
      orderBy: { order: 'asc' }
    })
    
    return { success: true, data: qnaItems }
  } catch (error) {
    console.error('Error fetching QnA items:', error)
    return { success: false, error: 'Failed to fetch QnA items' }
  }
}

export async function createQnaItem(data: any) {
  try {
    const qnaItem = await prisma.qnaItem.create({ data })
    revalidatePath('/')
    revalidatePath('/admin')
    return { success: true, data: qnaItem }
  } catch (error) {
    console.error('Error creating QnA item:', error)
    return { success: false, error: 'Failed to create QnA item' }
  }
}

export async function updateQnaItem(id: string, data: any) {
  try {
    const qnaItem = await prisma.qnaItem.update({
      where: { id },
      data
    })
    revalidatePath('/')
    revalidatePath('/admin')
    return { success: true, data: qnaItem }
  } catch (error) {
    console.error('Error updating QnA item:', error)
    return { success: false, error: 'Failed to update QnA item' }
  }
}

export async function deleteQnaItem(id: string) {
  try {
    await prisma.qnaItem.delete({
      where: { id }
    })
    revalidatePath('/')
    revalidatePath('/admin')
    return { success: true }
  } catch (error) {
    console.error('Error deleting QnA item:', error)
    return { success: false, error: 'Failed to delete QnA item' }
  }
}
