'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { unstable_noStore as noStore } from 'next/cache'

export async function getConfig() {
  noStore()
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

export async function updateConfig(data: {
  mode?: 'TRAINING_BASIC' | 'PCC_CLASS',
  maxQuotaSoftware?: number,
  maxQuotaNetwork?: number,
  maxQuotaMultimedia?: number,
  waLinkSoftware?: string,
  waLinkNetwork?: string,
  waLinkMultimedia?: string
}) {
  try {
    const config = await prisma.siteConfig.upsert({
      where: { id: 1 },
      update: data,
      create: { 
        id: 1, 
        mode: data.mode || 'TRAINING_BASIC',
        maxQuotaSoftware: data.maxQuotaSoftware ?? 35,
        maxQuotaNetwork: data.maxQuotaNetwork ?? 35,
        maxQuotaMultimedia: data.maxQuotaMultimedia ?? 35,
        waLinkSoftware: data.waLinkSoftware,
        waLinkNetwork: data.waLinkNetwork,
        waLinkMultimedia: data.waLinkMultimedia
      }
    })

    revalidatePath('/')
    revalidatePath('/admin')
    
    return { success: true, data: config }
  } catch (error) {
    console.error('Error updating config:', error)
    return { success: false, error: 'Failed to update config' }
  }
}
