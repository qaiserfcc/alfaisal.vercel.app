'use client'

import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'
import { LockKeyhole, Stethoscope } from 'lucide-react'
import { signIn, signUp } from '@/lib/auth-client'

const DEMO_USERS = [
  { email: 'doctor@medinotes.local', password: 'Doctor@12345', name: 'Dr. Faisal' },
  { email: 'manager@medinotes.local', password: 'Manager@12345', name: 'Clinic Manager' },
] as const

export default function SignInPage() {
  const router = useRouter()
  const [email, setEmail] = useState('doctor@medinotes.local')
  const [password, setPassword] = useState('Doctor@12345')
  const [error, setError] = useState('')
  const [pending, setPending] = useState(false)
  async function submit(event: FormEvent) {
    event.preventDefault(); setPending(true); setError('')
    let result = await signIn.email({ email, password })
    if (result.error && DEMO_USERS.some((user) => user.email === email && user.password === password)) {
      const demo = DEMO_USERS.find((user) => user.email === email)
      if (demo) {
        await signUp.email({ email: demo.email, password: demo.password, name: demo.name })
        result = await signIn.email({ email: demo.email, password: demo.password })
      }
    }
    if (result.error) { setError('Unable to sign in. Check the email and password.'); setPending(false); return }
    router.push(email.toLowerCase().includes('manager') ? '/manager' : '/'); router.refresh()
  }
  return <main className="flex min-h-screen items-center justify-center bg-[#f6f8f7] px-5 py-10 text-[#183b37] dark:bg-[#10211d] dark:text-[#eef8f3]"><div className="w-full max-w-md rounded-3xl border border-[#e1ebe6] bg-white p-8 shadow-xl dark:border-[#24413a] dark:bg-[#142b25]"><div className="mb-8 flex items-center gap-3"><span className="flex size-12 items-center justify-center rounded-2xl bg-[#d9f4e8] text-[#13795b]"><Stethoscope /></span><div><p className="text-xl font-bold">MediNotes</p><p className="text-xs uppercase tracking-widest text-[#81918d]">Secure clinic workspace</p></div></div><h1 className="text-2xl font-bold">Welcome back</h1><p className="mt-2 text-sm text-[#81918d]">Sign in to access protected patient records.</p><form onSubmit={submit} className="mt-7 flex flex-col gap-4"><label className="flex flex-col gap-2 text-sm font-semibold">Email<input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="h-11 rounded-xl border border-[#dfe9e4] px-3 outline-none focus:border-[#58aa88]" /></label><label className="flex flex-col gap-2 text-sm font-semibold">Password<input required type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="h-11 rounded-xl border border-[#dfe9e4] px-3 outline-none focus:border-[#58aa88]" /></label>{error && <p role="alert" className="text-sm font-semibold text-red-600">{error}</p>}<button disabled={pending} className="mt-2 inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#167a5b] text-sm font-bold text-white disabled:opacity-60"><LockKeyhole size={16} />{pending ? 'Signing in…' : 'Sign in securely'}</button></form><div className="mt-8 border-t border-[#e8efeb] pt-5"><p className="mb-3 text-xs font-bold uppercase tracking-widest text-[#81918d]">Demo access</p>{DEMO_USERS.map((user) => <button key={user.email} type="button" onClick={() => { setEmail(user.email); setPassword(user.password) }} className="mb-2 flex w-full items-center justify-between rounded-xl bg-[#f4f8f5] px-3 py-2 text-left text-xs dark:bg-[#19352d]"><span><strong className="block">{user.name}</strong>{user.email}</span><span className="font-bold text-[#16805f]">Use account</span></button>)}</div></div></main>
}
