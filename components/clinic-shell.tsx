'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { ClipboardList, LayoutDashboard, Pill, Stethoscope, Users, LibraryBig, LogOut } from 'lucide-react'
import { useSession, signOut } from '@/lib/auth-client'

const items = [
  { href: '/', label: 'Overview', icon: LayoutDashboard },
  { href: '/patients', label: 'Patients', icon: Users },
  { href: '/checkups', label: 'Checkups', icon: ClipboardList },
  { href: '/prescriptions', label: 'Prescriptions', icon: Pill },
  { href: '/medicines', label: 'Medicine library', icon: LibraryBig },
]

export function ClinicShell({ children, title, description, action }: { children: React.ReactNode; title: string; description: string; action?: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const { data: session, isPending } = useSession()
  if (isPending) return <div className="flex min-h-screen items-center justify-center bg-[#f6f8f7] text-sm text-[#81918d]">Checking secure session…</div>
  if (!session?.user) { router.replace('/sign-in'); return <div className="flex min-h-screen items-center justify-center bg-[#f6f8f7] text-sm text-[#81918d]">Redirecting to secure sign in…</div> }
  return <div className="min-h-screen bg-[#f6f8f7] text-[#183b37]">
    <aside className="fixed inset-y-0 left-0 hidden w-[248px] flex-col border-r border-[#e5ebe8] bg-white px-5 py-6 lg:flex">
      <Link href="/" className="mb-11 flex items-center gap-3 px-2"><span className="flex size-10 items-center justify-center rounded-xl bg-[#d9f4e8] text-[#13795b]"><Stethoscope /></span><span><span className="block text-[17px] font-bold">MediNotes</span><span className="block text-[11px] text-[#81918d]">CLINIC WORKSPACE</span></span></Link>
      <nav className="flex flex-col gap-2" aria-label="Main navigation">{items.map(({ href, label, icon: Icon }) => <Link key={href} href={href} className={`flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-semibold ${pathname === href ? 'bg-[#e5f7ee] text-[#16805f]' : 'text-[#73837f] hover:bg-[#f3f7f5]'}`}><Icon className="size-[18px]" />{label}</Link>)}</nav>
      <nav className="flex gap-2 overflow-x-auto pb-1 lg:hidden" aria-label="Mobile navigation">{items.map(({ href, label, icon: Icon }) => <Link key={href} href={href} className={`flex shrink-0 items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold ${pathname === href ? 'bg-[#e5f7ee] text-[#16805f]' : 'text-[#73837f] hover:bg-[#f3f7f5]'}`}><Icon className="size-4" />{label}</Link>)}</nav>
      <div className="mt-auto flex items-center gap-3 border-t border-[#edf0ef] pt-5"><span className="flex size-9 items-center justify-center rounded-full bg-[#d7e9ff] text-xs font-bold text-[#2764a5]">DF</span><span><span className="block text-sm font-bold">Dr. Faisal</span><span className="block text-xs text-[#84918e]">General physician</span></span></div>
    </aside>
    <main className="lg:pl-[248px]"><header className="flex min-h-[76px] items-center justify-between border-b border-[#e8eeeb] bg-white/90 px-5 py-4 backdrop-blur md:px-10"><div><p className="text-sm text-[#81918d]">Clinical workspace</p><h1 className="text-xl font-bold">{title}</h1><p className="mt-1 text-sm text-[#81918d]">{description}</p></div><div className="flex items-center gap-3">{action}<span className="flex size-10 items-center justify-center rounded-full bg-[#d7e9ff] text-xs font-bold text-[#2764a5]">DF</span></div></header><nav className="flex gap-2 overflow-x-auto border-b border-[#e8eeeb] bg-white px-5 py-3 lg:hidden" aria-label="Mobile navigation">{items.map(({ href, label, icon: Icon }) => <Link key={href} href={href} className={`flex shrink-0 items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold ${pathname === href ? 'bg-[#e5f7ee] text-[#16805f]' : 'text-[#73837f] hover:bg-[#f3f7f5]'}`}><Icon className="size-4" />{label}</Link>)}</nav><div className="mx-auto max-w-[1440px] px-5 py-8 md:px-10">{children}</div></main>
  </div>
}

export function Field({ label, children }: { label: string; children: React.ReactNode }) { return <label className="flex flex-col gap-1.5 text-sm font-semibold text-[#52645d]"><span>{label}</span>{children}</label> }
export const inputClass = 'h-11 rounded-xl border border-[#dfe9e4] bg-white px-3 text-sm outline-none transition focus:border-[#58aa88] focus:ring-2 focus:ring-[#d9f4e8]'
export const cardClass = 'rounded-2xl border border-[#e6ece9] bg-white p-5 md:p-6'
export const buttonClass = 'inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#167a5b] px-4 text-sm font-bold text-white transition hover:bg-[#12684d] disabled:cursor-not-allowed disabled:opacity-50'
export const secondaryButtonClass = 'inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-[#dfe9e4] bg-white px-3 text-sm font-bold text-[#42635a] transition hover:bg-[#f3f8f5]'
export function EmptyState({ text }: { text: string }) { return <div className="rounded-xl border border-dashed border-[#cddbd5] px-5 py-12 text-center text-sm text-[#81918d]">{text}</div> }

export type Patient = { id: string; name: string; patient_code: string; date_of_birth?: string; gender?: string; phone?: string; allergies?: string }
export type Medicine = { name: string; dosage?: string; duration?: string; frequency?: string }
export type Prescription = { id: string; patient_id: string; patient_name?: string; diagnosis: string; allergies?: string; risk_factors?: string; investigation?: string; medicines: Medicine[]; created_at?: string }
export type Checkup = { id: string; patient_id: string; patient_name?: string; diagnosis?: string; symptoms?: string; notes?: string; vitals?: Record<string, string>; created_at?: string }
