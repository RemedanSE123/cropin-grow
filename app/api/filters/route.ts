import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
  try {
    // Get unique regions, zones, and woredas for filters
    const regionsResult = await pool.query(
      'SELECT DISTINCT region FROM da_users WHERE region IS NOT NULL ORDER BY region'
    );
    
    const zonesResult = await pool.query(
      'SELECT DISTINCT zone FROM da_users WHERE zone IS NOT NULL ORDER BY zone'
    );
    
    const woredasResult = await pool.query(
      'SELECT DISTINCT woreda FROM da_users WHERE woreda IS NOT NULL ORDER BY woreda'
    );

    return NextResponse.json({
      regions: regionsResult.rows.map(r => r.region),
      zones: zonesResult.rows.map(z => z.zone),
      woredas: woredasResult.rows.map(w => w.woreda),
    });
  } catch (error) {
    console.error('Error fetching filters:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

