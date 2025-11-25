import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const { phoneNumber, password } = await request.json();

    // Admin login check
    if (phoneNumber === 'Admin@123' && password === 'Admin@123') {
      const token = Buffer.from(JSON.stringify({
        phoneNumber: 'Admin@123',
        isAdmin: true
      })).toString('base64');

      return NextResponse.json({
        token,
        woredaRepPhone: 'Admin@123',
        name: 'Administrator',
        isAdmin: true,
      });
    }

    // Fixed password check for Woreda Reps
    if (password !== '123') {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Query database for woreda rep (optimized with index)
    const result = await pool.query(
      'SELECT name, phone_number FROM woreda_reps WHERE phone_number = $1',
      [phoneNumber]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Invalid phone number' },
        { status: 401 }
      );
    }

    const woredaRep = result.rows[0];

    // In a real app, you'd use JWT. For simplicity, we'll use a simple token
    // Using phone_number as the identifier since there's no id column
    const token = Buffer.from(JSON.stringify({
      phoneNumber: woredaRep.phone_number,
      isAdmin: false
    })).toString('base64');

    return NextResponse.json({
      token,
      woredaRepPhone: woredaRep.phone_number,
      name: woredaRep.name,
      isAdmin: false,
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

