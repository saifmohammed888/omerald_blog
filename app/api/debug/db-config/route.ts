import { NextResponse } from 'next/server'

export async function GET() {
  // Only show in development
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json(
      { error: 'Not available in production' },
      { status: 403 }
    )
  }

  return NextResponse.json({
    env: {
      DB_HOST: process.env.DB_HOST || process.env.DB_HOST_1 || 'not set',
      DB_PORT: process.env.DB_PORT || process.env.DB_PORT_2 || 'not set',
      DB_USER: process.env.DB_USER || process.env.DB_USER_3 || 'not set',
      DB_PASSWORD: process.env.DB_PASSWORD || process.env.DB_PASSWORD_4
        ? '***set***'
        : 'not set',
      DB_NAME: process.env.DB_NAME || process.env.DB_NAME_5 || 'not set',
    },
    note: 'Check your .env file in the root directory',
  })
}

