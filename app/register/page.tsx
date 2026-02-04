import RegisterFormClient from '@/components/register/RegisterFormClient'
import { getRegistrations, getQuotaInfo, checkRegistrationByIp } from '@/app/actions/registrations'
import { headers } from 'next/headers'

// Force dynamic rendering and disable caching
export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function RegisterPage() {
  const headersList = await headers();
  const forwarded = headersList.get("x-forwarded-for");
  const ip = forwarded ? forwarded.split(",")[0].trim() : "unknown";

  // Check if current user (IP) is already registered
  const userRegistrationResult = await checkRegistrationByIp(ip);
  
  // Fetch initial data on server
  const [registrationsResult, quotaResult] = await Promise.all([
    getRegistrations(),
    getQuotaInfo()
  ])

  const registrations = registrationsResult.success && registrationsResult.data 
    ? registrationsResult.data.map(reg => ({
        ...reg,
        createdAt: reg.createdAt.toISOString()
      }))
    : []
  const quotaInfo = quotaResult.success && quotaResult.data ? quotaResult.data : null

  const existingRegistration = userRegistrationResult.success && userRegistrationResult.data
    ? {
        ...userRegistrationResult.data,
        createdAt: userRegistrationResult.data.createdAt.toISOString()
    }
    : null;
    
  // If we have existing registration for this IP but it wasn't caught in main list (should be there though if list is full),
  // ensuring we pass the correct object.
  // Also pass whatsappUrl if available
  const whatsappUrl = userRegistrationResult.success ? userRegistrationResult.whatsappUrl : null;

  return (
      <RegisterFormClient 
        initialRegistrations={registrations} 
        initialQuota={quotaInfo} 
        existingRegistration={existingRegistration}
        initialWaLink={whatsappUrl}
      />
  )
}

