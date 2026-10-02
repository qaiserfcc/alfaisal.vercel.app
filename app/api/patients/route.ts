import { NextResponse } from 'next/server'
import { pool } from '@/lib/db'

const doctorId = 'doctor-demo'

export async function GET() {
  const result = await pool.query(`SELECT id, name, patient_code, date_of_birth, gender, phone, allergies, created_at FROM patients WHERE user_id = $1 ORDER BY created_at DESC`, [doctorId])
  return NextResponse.json(result.rows)
}

export async function POST(request: Request) {
  const body = await request.json()
  if (!body.name?.trim()) return NextResponse.json({ error: 'Patient name is required' }, { status: 400 })
  const result = await pool.query(`INSERT INTO patients (user_id, name, patient_code, date_of_birth, gender, phone, allergies) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`, [doctorId, body.name.trim(), body.patientCode?.trim() || `PT-${Date.now().toString().slice(-4)}`, body.dateOfBirth || null, body.gender || null, body.phone || null, body.allergies || null])
  return NextResponse.json(result.rows[0], { status: 201 })
}
