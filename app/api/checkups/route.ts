import { NextResponse } from 'next/server'
import { pool } from '@/lib/db'

const doctorId = 'doctor-demo'

export async function GET() {
  const result = await pool.query(`SELECT c.id, c.patient_id, pt.name AS patient_name, c.diagnosis, c.symptoms, c.vitals, c.notes, c.created_at FROM clinical_entries c JOIN patients pt ON pt.id = c.patient_id WHERE c.user_id = $1 ORDER BY c.created_at DESC`, [doctorId])
  return NextResponse.json(result.rows)
}

export async function POST(request: Request) {
  const body = await request.json()
  if (!body.patientId || !body.diagnosis?.trim()) return NextResponse.json({ error: 'Patient and diagnosis are required' }, { status: 400 })
  const result = await pool.query(`INSERT INTO clinical_entries (user_id, patient_id, entry_type, diagnosis, symptoms, vitals, notes) VALUES ($1, $2, 'checkup', $3, $4, $5::jsonb, $6) RETURNING *`, [doctorId, body.patientId, body.diagnosis.trim(), body.symptoms?.trim() || null, JSON.stringify(body.vitals || {}), body.notes?.trim() || null])
  return NextResponse.json(result.rows[0], { status: 201 })
}
