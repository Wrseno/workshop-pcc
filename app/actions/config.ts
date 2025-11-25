'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function getConfig() {
  try {
    const config = await prisma.siteConfig.findUnique({
      where: { id: 1 }
    })

    if (!config) {
      // Create default config if not exists
      const newConfig = await prisma.siteConfig.create({
        data: { id: 1 }
      })
      return { success: true, data: newConfig }
    }

    return { success: true, data: config }
  } catch (error) {
    console.error('Error fetching config:', error)
    return { success: false, error: 'Failed to fetch config' }
  }
}

export async function updateConfig(mode: 'TRAINING_BASIC' | 'PCC_CLASS') {
  try {
    const config = await prisma.siteConfig.upsert({
      where: { id: 1 },
      update: { mode },
      create: { id: 1, mode }
    })

    revalidatePath('/')
    revalidatePath('/admin')
    
    return { success: true, data: config }
  } catch (error) {
    console.error('Error updating config:', error)
    return { success: false, error: 'Failed to update config' }
  }
}
