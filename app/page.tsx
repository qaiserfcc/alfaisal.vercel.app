'use client'

import { useMemo, useState } from 'react'
import {
  Activity,
  CalendarDays,
  ChevronRight,
  ClipboardList,
  FileText,
  HeartPulse,
  History,
  LayoutDashboard,
  Menu,
  Pill,
  Plus,
  Search,
  Settings,
  Stethoscope,
  UserRound,
  Users,
  X,
} from 'lucide-react'

const patients = [
  { name: 'Aarav Mehta', id: 'PT-1048', age: 34, gender: 'Male', condition: 'Type 2 diabetes', lastVisit: 'Today, 9:30 AM', initials: 'AM', color: 'mint' },
  { name: 'Priya Sharma', id: 'PT-1047', age: 28, gender: 'Female', condition: 'Migraine', lastVisit: 'Yesterday', initials: 'PS', color: 'lavender' },
  { name: 'Rohan Kapoor', id: 'PT-1046', age: 51, gender: 'Male', condition: 'Hypertension', lastVisit: 'Sep 28, 2026', initials: 'RK', color: 'peach' },
  { name: 'Nisha Iyer', id: 'PT-1045', age: 42, gender: 'Female', condition: 'Hypothyroidism', lastVisit: 'Sep 26, 2026', initials: 'NI', color: 'blue' },
]

const suggestions = ['Type 2 diabetes', 'Hypertension', 'Acute bronchitis', 'Migraine', 'Seasonal allergies']
const medicines = ['Metformin 500 mg', 'Amlodipine 5 mg', 'Cetirizine 10 mg', 'Paracetamol 650 mg']

export default function Page() {
  const [activeTab, setActiveTab] = useState('Overview')
  const [selectedPatient, setSelectedPatient] = useState(patients[0])
  const [diagnosis, setDiagnosis] = useState('Type 2 diabetes')
  const [medicine, setMedicine] = useState('Metformin 500 mg')
  const [saved, setSaved] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [showAll, setShowAll] = useState(false)
  const visiblePatients = showAll ? patients : patients.slice(0, 3)
  const dateLabel = useMemo(() => new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date()), [])

  return (
    <main className="min-h-screen bg-[#f6f8f7] text-[#183b37]">
      <aside className={`fixed inset-y-0 left-0 z-30 flex w-[248px] flex-col border-r border-[#e5ebe8] bg-white px-5 py-6 transition-transform lg:translate-x-0 ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="mb-11 flex items-center gap-3 px-2"><div className="flex size-10 items-center justify-center rounded-xl bg-[#d9f4e8] text-[#13795b]"><Stethoscope /></div><div><div className="text-[17px] font-bold tracking-tight">MediNotes</div><div className="text-[11px] font-medium text-[#81918d]">CLINIC WORKSPACE</div></div><button onClick={() => setMobileOpen(false)} className="ml-auto lg:hidden"><X /></button></div>
        <nav className="flex flex-col gap-2" aria-label="Main navigation">{[['Overview', LayoutDashboard], ['Patients', Users], ['Checkups', ClipboardList], ['Prescriptions', Pill]].map(([label, Icon]) => <button key={label as string} onClick={() => { setActiveTab(label as string); setMobileOpen(false) }} className={`flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-semibold transition ${activeTab === label ? 'bg-[#e5f7ee] text-[#16805f]' : 'text-[#73837f] hover:bg-[#f3f7f5]'}`}><Icon className="size-[18px]" />{label as string}{label === 'Patients' && <span className="ml-auto rounded-full bg-[#edf2ef] px-2 py-0.5 text-[11px] text-[#74827e]">128</span>}</button>)}</nav>
        <div className="mt-auto flex flex-col gap-2 border-t border-[#edf0ef] pt-5"><button className="flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-semibold text-[#73837f] hover:bg-[#f3f7f5]"><Settings className="size-[18px]" />Settings</button><div className="mt-3 flex items-center gap-3 rounded-xl bg-[#f6f8f7] p-3"><div className="flex size-9 items-center justify-center rounded-full bg-[#d7e9ff] text-xs font-bold text-[#2764a5]">DS</div><div className="min-w-0"><p className="truncate text-sm font-bold">Dr. Sarah Davis</p><p className="text-xs text-[#84918e]">General physician</p></div></div></div>
      </aside>
      {mobileOpen && <button aria-label="Close navigation" onClick={() => setMobileOpen(false)} className="fixed inset-0 z-20 bg-[#153b35]/20 lg:hidden" />}
      <section className="lg:pl-[248px]"><header className="flex h-[76px] items-center justify-between border-b border-[#e8eeeb] bg-white/80 px-5 backdrop-blur md:px-10"><div className="flex items-center gap-3"><button onClick={() => setMobileOpen(true)} className="lg:hidden"><Menu /></button><div><p className="text-sm text-[#81918d]">Wednesday, {dateLabel}</p><h1 className="text-xl font-bold tracking-tight">Good morning, Dr. Davis</h1></div></div><div className="flex items-center gap-3"><button className="flex size-10 items-center justify-center rounded-full border border-[#e6ece9] bg-white text-[#7e8d89]"><Search className="size-[18px]" /></button><div className="flex size-10 items-center justify-center rounded-full bg-[#d7e9ff] text-xs font-bold text-[#2764a5]">DS</div></div></header>
        <div className="mx-auto max-w-[1440px] px-5 py-8 md:px-10"><div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><p className="mb-2 text-sm font-semibold uppercase tracking-[0.14em] text-[#15916b]">Clinical overview</p><h2 className="text-[30px] font-bold tracking-[-0.04em]">Your practice at a glance</h2><p className="mt-1 text-[15px] text-[#81918d]">Everything you need to keep your patients moving forward.</p></div><button className="flex h-11 items-center justify-center gap-2 rounded-xl bg-[#167a5b] px-5 text-sm font-bold text-white shadow-sm transition hover:bg-[#116a4f]"><Plus className="size-[18px]" />New patient</button></div>
          <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{[['Total patients','128','+8.2% this month',Users,'mint'],['Today’s checkups','12','3 remaining',CalendarDays,'lavender'],['Pending prescriptions','5','Needs attention',FileText,'peach'],['Follow-ups due','8','Next 7 days',History,'blue']].map(([label,value,note,Icon,color]) => <div key={label as string} className="rounded-2xl border border-[#e6ece9] bg-white p-5"><div className="mb-5 flex items-start justify-between"><p className="text-sm font-semibold text-[#74837f]">{label as string}</p><div className={`flex size-9 items-center justify-center rounded-xl ${color === 'mint' ? 'bg-[#e0f7ed] text-[#15916b]' : color === 'lavender' ? 'bg-[#eeeaff] text-[#7563c8]' : color === 'peach' ? 'bg-[#fff0e6] text-[#c97845]' : 'bg-[#e5f1ff] text-[#4a82c2]'}`}><Icon className="size-[18px]" /></div></div><div className="flex items-end justify-between"><p className="text-[28px] font-bold tracking-[-0.04em]">{value as string}</p><p className="text-xs font-semibold text-[#45a17f]">{note as string}</p></div></div>)}</div>
          <div className="grid gap-6 xl:grid-cols-[1.35fr_0.65fr]"> <div className="rounded-2xl border border-[#e6ece9] bg-white p-6"><div className="mb-5 flex items-center justify-between"><div><h3 className="text-lg font-bold">Recent patients</h3><p className="mt-1 text-sm text-[#899692]">Quick access to your latest records</p></div><button onClick={() => setShowAll(!showAll)} className="flex items-center gap-1 text-sm font-bold text-[#16805f]">View all <ChevronRight className="size-4" /></button></div><div className="overflow-x-auto"><table className="w-full min-w-[620px] text-left"><thead><tr className="border-b border-[#edf1ef] text-xs font-bold uppercase tracking-[0.08em] text-[#9aa7a3]"><th className="pb-3">Patient</th><th className="pb-3">Age / gender</th><th className="pb-3">Last diagnosis</th><th className="pb-3">Last visit</th><th /></tr></thead><tbody>{visiblePatients.map((patient) => <tr key={patient.id} onClick={() => setSelectedPatient(patient)} className={`cursor-pointer border-b border-[#f0f3f1] text-sm last:border-0 hover:bg-[#fafcfb] ${selectedPatient.id === patient.id ? 'bg-[#fbfdfc]' : ''}`}><td className="py-4"><div className="flex items-center gap-3"><div className={`flex size-9 items-center justify-center rounded-full text-xs font-bold ${patient.color === 'mint' ? 'bg-[#dff5eb] text-[#208261]' : patient.color === 'lavender' ? 'bg-[#ede9ff] text-[#7563c8]' : patient.color === 'peach' ? 'bg-[#fff0e6] text-[#c97845]' : 'bg-[#e5f1ff] text-[#4a82c2]'}`}>{patient.initials}</div><div><p className="font-bold">{patient.name}</p><p className="text-xs text-[#91a09b]">{patient.id}</p></div></div></td><td className="py-4 text-[#687873]">{patient.age} / {patient.gender}</td><td className="py-4"><span className="rounded-full bg-[#eef8f3] px-2.5 py-1 text-xs font-semibold text-[#348b6b]">{patient.condition}</span></td><td className="py-4 text-[#687873]">{patient.lastVisit}</td><td className="py-4 text-right"><ChevronRight className="ml-auto size-4 text-[#a6b1ad]" /></td></tr>)}</tbody></table></div></div>
            <div className="rounded-2xl border border-[#e6ece9] bg-white p-6"><div className="mb-6 flex items-center justify-between"><div><h3 className="text-lg font-bold">Create prescription</h3><p className="mt-1 text-sm text-[#899692]">For {selectedPatient.name}</p></div><div className="flex size-10 items-center justify-center rounded-xl bg-[#e0f7ed] text-[#15916b]"><Pill className="size-[19px]" /></div></div><div className="flex flex-col gap-4"><label className="text-xs font-bold uppercase tracking-[0.08em] text-[#899692]">Diagnosis<input value={diagnosis} onChange={(e) => setDiagnosis(e.target.value)} list="diagnoses" className="mt-2 h-11 w-full rounded-xl border border-[#e2eae6] bg-[#fbfcfb] px-3 text-sm font-semibold outline-none ring-[#a7e4c9] focus:ring-2" /><datalist id="diagnoses">{suggestions.map((item) => <option key={item} value={item} />)}</datalist></label><label className="text-xs font-bold uppercase tracking-[0.08em] text-[#899692]">Medicine<input value={medicine} onChange={(e) => setMedicine(e.target.value)} list="medicines" className="mt-2 h-11 w-full rounded-xl border border-[#e2eae6] bg-[#fbfcfb] px-3 text-sm font-semibold outline-none ring-[#a7e4c9] focus:ring-2" /><datalist id="medicines">{medicines.map((item) => <option key={item} value={item} />)}</datalist></label><div className="grid grid-cols-2 gap-3"><label className="text-xs font-bold uppercase tracking-[0.08em] text-[#899692]">Dosage<select className="mt-2 h-11 w-full rounded-xl border border-[#e2eae6] bg-[#fbfcfb] px-3 text-sm font-semibold outline-none"><option>Once daily</option><option>Twice daily</option><option>As needed</option></select></label><label className="text-xs font-bold uppercase tracking-[0.08em] text-[#899692]">Duration<select className="mt-2 h-11 w-full rounded-xl border border-[#e2eae6] bg-[#fbfcfb] px-3 text-sm font-semibold outline-none"><option>7 days</option><option>14 days</option><option>30 days</option></select></label></div><button onClick={() => setSaved(true)} className="mt-2 h-11 rounded-xl bg-[#167a5b] text-sm font-bold text-white transition hover:bg-[#116a4f]">{saved ? 'Prescription saved' : 'Save prescription'}</button><button className="text-center text-xs font-semibold text-[#16805f]">Use previous prescription</button></div></div>
          </div>
          <div className="mt-6 rounded-2xl border border-[#dcefe5] bg-[#effaf4] p-5"><div className="flex items-start gap-3"><div className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-xl bg-white text-[#16805f]"><HeartPulse className="size-[18px]" /></div><div><h3 className="text-sm font-bold text-[#1b5e48]">Smart memory is on</h3><p className="mt-1 text-sm leading-relaxed text-[#598172]">MediNotes remembers diagnoses, medicines, and instructions from previous entries so you can prescribe faster and stay consistent.</p></div></div></div>
        </div></section>
    </main>
  )
}
