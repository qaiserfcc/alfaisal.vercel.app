'use client'

import { useEffect, useState } from 'react'
import { ArrowLeft, Printer } from 'lucide-react'
import Link from 'next/link'
import { ClinicShell, EmptyState, Prescription, buttonClass, cardClass } from '@/components/clinic-shell'
import { PrintPrescription } from '@/components/print-prescription'

export default function PrescriptionDetail({ params }: { params: Promise<{ id: string }> }) {
  const [item, setItem] = useState<Prescription | null>(null)
  useEffect(() => { params.then(({ id }) => fetch(`/api/prescriptions`).then((r) => r.json()).then((items: Prescription[]) => setItem(items.find((entry) => entry.id === id) || null))) }, [params])
  return <ClinicShell title="Prescription details" description="Review the complete medication plan before printing." action={<Link className={buttonClass} href="/prescriptions"><ArrowLeft data-icon="inline-start" />Back to prescriptions</Link>}>
    {!item ? <EmptyState text="Prescription not found." /> : <><article className={`${cardClass} mx-auto max-w-3xl`}><div className="flex items-start justify-between border-b border-[#e6ece9] pb-5"><div><p className="text-sm text-[#81918d]">Patient</p><h2 className="text-2xl font-bold">{item.patient_name}</h2><p className="mt-2 text-sm text-[#16805f]">{item.diagnosis}</p></div><button className={buttonClass} onClick={() => window.print()}><Printer data-icon="inline-start" />Print</button></div><div className="mt-6 flex flex-col gap-3">{item.medicines.map((medicine, index) => <div className="grid grid-cols-4 gap-3 rounded-xl bg-[#f7faf8] p-4 text-sm" key={`${medicine.name}-${index}`}><strong>{medicine.name}</strong><span>{medicine.dosage || '—'}</span><span>{medicine.frequency || '—'}</span><span>{medicine.duration || '—'}</span></div>)}</div></article><PrintPrescription item={item} /></>}
  </ClinicShell>
}
