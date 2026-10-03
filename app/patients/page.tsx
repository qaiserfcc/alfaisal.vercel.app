'use client'

import { useEffect, useMemo, useState } from 'react'
import { CalendarDays, Edit3, MoreHorizontal, Plus, Search, Trash2, UserRound, X } from 'lucide-react'
import { ClinicShell, EmptyState, Field, Patient, buttonClass, cardClass, inputClass, secondaryButtonClass } from '@/components/clinic-shell'

type PatientForm = { name: string; phone: string; dateOfBirth: string; gender: string; allergies: string }
const blankForm: PatientForm = { name: '', phone: '', dateOfBirth: '', gender: '', allergies: '' }

export default function PatientsPage() {
  const [patients, setPatients] = useState<Patient[]>([])
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Patient | null>(null)
  const [form, setForm] = useState<PatientForm>(blankForm)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const load = async () => { const response = await fetch('/api/patients'); if (response.ok) setPatients(await response.json()) }
  useEffect(() => { load() }, [])
  const filtered = useMemo(() => patients.filter((p) => `${p.name} ${p.patient_code} ${p.phone || ''}`.toLowerCase().includes(query.toLowerCase())), [patients, query])
  const startNew = () => { setEditing(null); setForm(blankForm); setError(''); setOpen(true) }
  const startEdit = (patient: Patient) => { setEditing(patient); setForm({ name: patient.name, phone: patient.phone || '', dateOfBirth: patient.date_of_birth ? String(patient.date_of_birth).slice(0, 10) : '', gender: patient.gender || '', allergies: patient.allergies || '' }); setError(''); setOpen(true) }
  const save = async () => {
    setError(''); if (!form.name.trim()) return setError('Patient name is required.')
    setBusy(true)
    const response = await fetch('/api/patients' + (editing ? `?id=${editing.id}` : ''), { method: editing ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
    setBusy(false); if (!response.ok) return setError('Could not save patient.')
    const patient = await response.json(); setPatients((current) => editing ? current.map((item) => item.id === patient.id ? patient : item) : [patient, ...current]); setOpen(false)
  }
  const remove = async (patient: Patient) => { if (!window.confirm(`Delete ${patient.name}? This cannot be undone.`)) return; const response = await fetch(`/api/patients?id=${patient.id}`, { method: 'DELETE' }); if (response.ok) setPatients((current) => current.filter((item) => item.id !== patient.id)) }

  return <ClinicShell title="Patients" description="Manage patient records, contact details, allergies, and visit readiness." action={<button className={buttonClass} onClick={startNew}><Plus data-icon="inline-start" />New patient</button>}>
    {open && <div className={`${cardClass} mb-6`}><div className="mb-5 flex items-center justify-between"><div><h2 className="text-lg font-bold">{editing ? 'Edit patient' : 'Add a patient'}</h2><p className="text-sm text-[#81918d]">Keep the patient profile accurate for every future visit.</p></div><button onClick={() => setOpen(false)} aria-label="Close"><X /></button></div><div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"><Field label="Full name"><input autoFocus className={inputClass} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Ayesha Khan" /></Field><Field label="Phone"><input className={inputClass} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="03XX XXXXXXX" /></Field><Field label="Date of birth"><input type="date" className={inputClass} value={form.dateOfBirth} onChange={(e) => setForm({ ...form, dateOfBirth: e.target.value })} /></Field><Field label="Gender"><select className={inputClass} value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })}><option value="">Select gender</option><option>Female</option><option>Male</option><option>Other</option></select></Field><Field label="Allergies"><input className={inputClass} value={form.allergies} onChange={(e) => setForm({ ...form, allergies: e.target.value })} placeholder="None known" /></Field></div>{error && <p role="alert" className="mt-4 text-sm font-semibold text-red-600">{error}</p>}<div className="mt-5 flex justify-end gap-2"><button className={secondaryButtonClass} onClick={() => setOpen(false)}>Cancel</button><button className={buttonClass} disabled={busy} onClick={save}>{busy ? 'Saving…' : editing ? 'Update patient' : 'Save patient'}</button></div></div>}
    <div className="mb-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-center"><div className="flex gap-8"><div><p className="text-3xl font-bold">{patients.length}</p><p className="text-sm text-[#81918d]">registered patients</p></div><div><p className="text-3xl font-bold text-[#16805f]">{filtered.length}</p><p className="text-sm text-[#81918d]">shown</p></div></div><label className="flex h-11 w-full items-center gap-2 rounded-xl border border-[#dfe9e4] bg-white px-3 sm:max-w-sm"><Search className="size-4 text-[#81918d]" /><input aria-label="Search patients" className="min-w-0 flex-1 outline-none" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search name, code, or phone" /></label></div>
    {filtered.length ? <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{filtered.map((patient) => <article key={patient.id} className={cardClass}><div className="flex items-start justify-between"><div className="flex size-11 items-center justify-center rounded-full bg-[#dff5eb] font-bold text-[#208261]"><UserRound /></div><div className="flex items-center gap-2"><span className="rounded-full bg-[#f0f5f2] px-2.5 py-1 text-xs font-bold text-[#6d827a]">{patient.patient_code}</span><details className="relative"><summary className="flex size-8 cursor-pointer list-none items-center justify-center rounded-lg hover:bg-[#eef5f1]" aria-label={`Actions for ${patient.name}`}><MoreHorizontal /></summary><div className="absolute right-0 z-10 mt-1 w-36 rounded-xl border border-[#dfe9e4] bg-white p-1 shadow-lg"><button className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm hover:bg-[#f3f8f5]" onClick={() => startEdit(patient)}><Edit3 />Edit</button><button className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50" onClick={() => remove(patient)}><Trash2 />Delete</button></div></details></div></div><h2 className="mt-5 text-lg font-bold">{patient.name}</h2><dl className="mt-3 flex flex-col gap-2 text-sm text-[#70827c]"><div className="flex justify-between gap-3"><dt>Phone</dt><dd className="font-semibold text-[#38584f]">{patient.phone || 'Not provided'}</dd></div><div className="flex justify-between gap-3"><dt>Gender</dt><dd className="font-semibold text-[#38584f]">{patient.gender || 'Not provided'}</dd></div><div className="flex justify-between gap-3"><dt>Allergies</dt><dd className="max-w-[65%] text-right font-semibold text-[#38584f]">{patient.allergies || 'None recorded'}</dd></div></dl><div className="mt-4 flex items-center gap-2 border-t border-[#edf2ef] pt-3 text-xs text-[#81918d]"><CalendarDays /> Profile available for checkups and prescriptions</div></article>)}</div> : <EmptyState text={query ? 'No patients match your search.' : 'No patients yet. Add your first patient to begin.'} />}
  </ClinicShell>
}
