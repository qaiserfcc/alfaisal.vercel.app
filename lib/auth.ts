import { betterAuth } from 'better-auth'
import { pool } from '@/lib/db'

const origin = (value?: string) => (value ? [value] : [])

export const auth = betterAuth({
  database: pool,
  baseURL:
    process.env.BETTER_AUTH_URL ??
    (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : undefined) ??
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined) ??
    process.env.V0_RUNTIME_URL,
  emailAndPassword: { enabled: true, autoSignIn: true },
  trustedOrigins: [
    ...(process.env.NODE_ENV === 'development'
      ? ['http://localhost:3000', ...origin(process.env.V0_RUNTIME_URL), ...origin(process.env.V0_DEV_APP_URL), ...origin(process.env.V0_BUILD_URL), ...origin(process.env.V0_SANDBOX_URL)]
      : []),
    ...(process.env.NODE_ENV === 'production'
      ? [
          ...(process.env.VERCEL_URL ? [`https://${process.env.VERCEL_URL}`] : []),
          ...(process.env.VERCEL_PROJECT_PRODUCTION_URL ? [`https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`] : []),
        ]
      : []),
  ],
  session: { expiresIn: 60 * 60 * 24 * 7, updateAge: 60 * 60 * 24 },
  ...(process.env.NODE_ENV === 'development'
    ? { advanced: { defaultCookieAttributes: { sameSite: 'none' as const, secure: true } } }
    : {}),
})

export const DEMO_USERS = [
  { email: 'doctor@medinotes.local', password: 'Doctor@12345', name: 'Dr. Faisal', role: 'doctor' },
  { email: 'manager@medinotes.local', password: 'Manager@12345', name: 'Clinic Manager', role: 'manager' },
] as const

export function getRole(email?: string | null) {
  return email?.toLowerCase() === 'manager@medinotes.local' ? 'manager' : 'doctor'
}

export async function getSession() {
  const { headers } = await import('next/headers')
  return auth.api.getSession({ headers: await headers() })
}

export async function requireSession() {
  const session = await getSession()
  if (!session?.user) throw new Error('Unauthorized')
  return session
}

export async function requireRole(role: 'doctor' | 'manager') {
  const session = await requireSession()
  if (getRole(session.user.email) !== role) throw new Error('Forbidden')
  return session
}
