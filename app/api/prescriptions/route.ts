import { NextResponse } from 'next/server'
import { pool } from '@/lib/db'

const doctorId = 'doctor-demo'

export async function GET(request: Request) {
  const params = new URL(request.url).searchParams
  const patientId = params.get('patientId')
  const result = await pool.query(`SELECT p.id, p.patient_id, pt.name AS patient_name, p.diagnosis, p.instructions, p.created_at, COALESCE(json_agg(json_build_object('name', pm.medicine_name, 'dosage', pm.dosage, 'duration', pm.duration, 'frequency', pm.frequency) ORDER BY pm.created_at) FILTER (WHERE pm.id IS NOT NULL), '[]') AS medicines FROM prescriptions p JOIN patients pt ON pt.id = p.patient_id LEFT JOIN prescription_medicines pm ON pm.prescription_id = p.id WHERE p.user_id = $1 AND ($2::uuid IS NULL OR p.patient_id = $2::uuid) GROUP BY p.id, pt.name ORDER BY p.created_at DESC`, [doctorId, patientId || null])
  return NextResponse.json(result.rows)
}

export async function PUT(request: Request) {
  const body = await request.json()
  const diagnoses = Array.isArray(body.diagnoses) ? body.diagnoses.map((item: unknown) => String(item).trim()).filter(Boolean) : []
  const medicines = Array.isArray(body.medicines) ? body.medicines.filter((item: { name?: string }) => item?.name?.trim()) : []
  if (!body.id || !body.patientId || !diagnoses.length || !medicines.length) return NextResponse.json({ error: 'Prescription fields are required' }, { status: 400 })
  const client = await pool.connect()
  try {
    await client.query('BEGIN')
    const updated = await client.query(`UPDATE prescriptions SET patient_id = $1, diagnosis = $2 WHERE id = $3 AND user_id = $4 RETURNING *`, [body.patientId, diagnoses.join(', '), body.id, doctorId])
    if (!updated.rowCount) { await client.query('ROLLBACK'); return NextResponse.json({ error: 'Prescription not found' }, { status: 404 }) }
    await client.query('DELETE FROM prescription_medicines WHERE prescription_id = $1', [body.id])
    for (const item of medicines) await client.query(`INSERT INTO prescription_medicines (prescription_id, medicine_name, dosage, duration, frequency) VALUES ($1, $2, $3, $4, $5)`, [body.id, item.name.trim(), item.dosage || null, item.duration || null, item.frequency || null])
    await client.query('COMMIT')
    return NextResponse.json(updated.rows[0])
  } catch { await client.query('ROLLBACK'); return NextResponse.json({ error: 'Could not update prescription' }, { status: 500 }) }
  finally { client.release() }
}

export async function POST(request: Request) {
  const body = await request.json()
  const diagnoses = Array.isArray(body.diagnoses) ? body.diagnoses.map((item: unknown) => String(item).trim()).filter(Boolean) : (body.diagnosis?.trim() ? [body.diagnosis.trim()] : [])
  const medicines = Array.isArray(body.medicines) ? body.medicines.filter((item: { name?: string }) => item?.name?.trim()) : (body.medicine?.trim() ? [{ name: body.medicine.trim(), dosage: body.dosage, duration: body.duration, frequency: body.frequency }] : [])
  if (!body.patientId || !diagnoses.length || !medicines.length) return NextResponse.json({ error: 'Patient, diagnosis, and medicine are required' }, { status: 400 })
  const client = await pool.connect()
  try {
    await client.query('BEGIN')
    const prescription = await client.query(`INSERT INTO prescriptions (user_id, patient_id, diagnosis, instructions) VALUES ($1, $2, $3, $4) RETURNING *`, [doctorId, body.patientId, diagnoses.join(', '), body.instructions || null])
    for (const item of medicines) await client.query(`INSERT INTO prescription_medicines (prescription_id, medicine_name, dosage, duration, frequency) VALUES ($1, $2, $3, $4, $5)`, [prescription.rows[0].id, item.name.trim(), item.dosage || null, item.duration || null, item.frequency || null])
    await client.query('COMMIT')
    return NextResponse.json(prescription.rows[0], { status: 201 })
  } catch (error) {
    await client.query('ROLLBACK')
    return NextResponse.json({ error: 'Could not save prescription' }, { status: 500 })
  } finally { client.release() }
}
