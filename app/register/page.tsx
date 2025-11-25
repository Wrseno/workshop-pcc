import RegisterFormClient from '@/components/register/RegisterFormClient'
import { getRegistrations, getQuotaInfo } from '@/app/actions/registrations'

export default async function RegisterPage() {
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

  return <RegisterFormClient initialRegistrations={registrations} initialQuota={quotaInfo} />
}
