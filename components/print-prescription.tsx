'use client'

import { Stethoscope } from 'lucide-react'
import type { Prescription } from '@/components/clinic-shell'

export function PrintPrescription({ item }: { item: Prescription }) {
  return <section className="print-sheet" aria-label="Printable prescription">
    <header className="print-header"><div className="print-doctor-heading">
      <div className="print-doctor-details"><p className="print-role">Assistant Professor</p><h1>Dr. Hafiz Muhammad Faisal Nadeem</h1><p>MBBS (Gold Medalist), B.Sc</p><p>MD. Pulmonology (KEMU), MRCP (UK)</p><p>Speciality Certificate Respiratory Medicine (UK)</p><p>Member of European Respiratory Society</p><p>MCHPE (KEMU)</p></div>
      <div className="print-medical-mark"><Stethoscope /></div>
      <div className="print-doctor-details print-doctor-urdu" dir="rtl"><p>اسسٹنٹ پروفیسر</p><h1>ڈاکٹر حافظ محمد فیصل ندیم</h1><p>ایم بی بی ایس (گولڈ میڈلسٹ)، بی ایس سی</p><p>ایم ڈی پلمونولوجی، ایم آر سی پی (یو کے)</p><p>سانس کی بیماریوں کے ماہر</p><p>یورپین ریسپائریٹری سوسائٹی کے رکن</p><p>ایم سی ایچ پی ای (کے ای ایم یو)</p></div>
    </div></header>
    <div className="print-meta"><span>Prescription</span><span>{item.created_at ? new Date(item.created_at).toLocaleDateString() : new Date().toLocaleDateString()}</span></div>
    <div className="print-patient"><div><span>Patient</span><strong>{item.patient_name || 'Patient'}</strong></div><div><span>Date</span><strong>{item.created_at ? new Date(item.created_at).toLocaleDateString() : new Date().toLocaleDateString()}</strong></div></div>
    <div className="print-clinical-layout">
      <aside className="print-clinical-sidebar" aria-label="Clinical summary">
        <section className="print-clinical-section"><h2>DX</h2><p>{item.diagnosis || 'Not recorded'}</p></section>
        <section className="print-clinical-section"><h2>Allergies</h2><p>Not recorded</p></section>
        <section className="print-clinical-section"><h2>Risk factors</h2><p>Not recorded</p></section>
        <section className="print-clinical-section"><h2>Investigation</h2><p>Not recorded</p></section>
      </aside>
      <main className="print-rx" aria-label="Prescription medicines"><div className="print-rx-title">Rx</div>{item.medicines.map((medicine, index) => <div className="print-medicine" key={`${medicine.name}-${index}`}><strong>{index + 1}. {medicine.name}</strong><span>{medicine.dosage || '—'}</span><span>{medicine.frequency || '—'}</span><span>{medicine.duration || '—'}</span></div>)}</main>
    </div>
    <footer className="print-footer"><span>Lahore - 03014286477</span><span>Sheikhupura - 03319435865</span></footer>
  </section>
}
