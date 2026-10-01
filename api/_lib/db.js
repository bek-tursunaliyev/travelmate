// Postgres (Neon, provisioned through the Vercel Marketplace). DATABASE_URL is the pooled URL.
import { neon } from '@neondatabase/serverless'

let client
export function sql(strings, ...values) {
  if (!client) {
    if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is not configured')
    client = neon(process.env.DATABASE_URL)
  }
  return client(strings, ...values)
}

// Created on first use so a fresh database works without a manual migration.
let ready
export function ensureSchema() {
  ready ??= sql`
    CREATE TABLE IF NOT EXISTS bookings (
      user_id   text        NOT NULL,
      id        text        NOT NULL,
      name      text        NOT NULL,
      kind      text,
      price     numeric(12, 2),
      meta      text,
      booked_at timestamptz NOT NULL DEFAULT now(),
      PRIMARY KEY (user_id, id)
    )`.catch((err) => {
    ready = undefined
    throw err
  })
  return ready
}
