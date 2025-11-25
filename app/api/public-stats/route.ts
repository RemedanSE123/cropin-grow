import { NextResponse } from 'next/server';
import pool from '@/lib/db';

// Public API endpoint for dashboard stats (no authentication required)
export async function GET() {
  try {
    // Get all KPIs in a single query for better performance
    const statsQuery = `
      SELECT 
        COUNT(*) as total_das,
        COALESCE(SUM(total_collected_data), 0) as total_data,
        COUNT(DISTINCT reporting_manager_mobile) as total_reps,
        COUNT(CASE WHEN status = 'Active' THEN 1 END) as active_das,
        COUNT(CASE WHEN status = 'Inactive' THEN 1 END) as inactive_das,
        COUNT(CASE WHEN status = 'Pending' THEN 1 END) as pending_das,
        AVG(total_collected_data) as avg_data_per_da
      FROM da_users
    `;

    const statsResult = await pool.query(statsQuery);
    const stats = statsResult.rows[0];

    // Get data by region
    const regionDataQuery = `
      SELECT 
        region,
        COUNT(*) as da_count,
        COALESCE(SUM(total_collected_data), 0) as total_data
      FROM da_users
      WHERE region IS NOT NULL
      GROUP BY region
      ORDER BY total_data DESC
      LIMIT 10
    `;

    const regionResult = await pool.query(regionDataQuery);

    // Get data by zone (top 10)
    const zoneDataQuery = `
      SELECT 
        zone,
        COUNT(*) as da_count,
        COALESCE(SUM(total_collected_data), 0) as total_data
      FROM da_users
      WHERE zone IS NOT NULL
      GROUP BY zone
      ORDER BY total_data DESC
      LIMIT 10
    `;

    const zoneResult = await pool.query(zoneDataQuery);

    // Get monthly trend (if you have date columns, otherwise use current data)
    const trendQuery = `
      SELECT 
        status,
        COUNT(*) as count,
        COALESCE(SUM(total_collected_data), 0) as total_data
      FROM da_users
      GROUP BY status
    `;

    const trendResult = await pool.query(trendQuery);

    return NextResponse.json({
      stats: {
        totalDAs: parseInt(stats.total_das) || 0,
        totalData: parseInt(stats.total_data) || 0,
        totalReps: parseInt(stats.total_reps) || 0,
        activeDAs: parseInt(stats.active_das) || 0,
        inactiveDAs: parseInt(stats.inactive_das) || 0,
        pendingDAs: parseInt(stats.pending_das) || 0,
        avgDataPerDA: parseFloat(stats.avg_data_per_da) || 0,
      },
      regionData: regionResult.rows,
      zoneData: zoneResult.rows,
      statusTrend: trendResult.rows,
    });
  } catch (error) {
    console.error('Error fetching public stats:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

