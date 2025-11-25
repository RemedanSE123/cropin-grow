-- Performance optimization indexes for Cropin Grow System
-- Run this script to improve database query performance

-- Indexes for woreda_reps table
CREATE INDEX IF NOT EXISTS idx_woreda_reps_phone_number ON woreda_reps(phone_number);

-- Indexes for da_users table (most frequently queried columns)
CREATE INDEX IF NOT EXISTS idx_da_users_reporting_manager_mobile ON da_users(reporting_manager_mobile);
CREATE INDEX IF NOT EXISTS idx_da_users_region ON da_users(region);
CREATE INDEX IF NOT EXISTS idx_da_users_zone ON da_users(zone);
CREATE INDEX IF NOT EXISTS idx_da_users_woreda ON da_users(woreda);
CREATE INDEX IF NOT EXISTS idx_da_users_contactnumber ON da_users(contactnumber);
CREATE INDEX IF NOT EXISTS idx_da_users_status ON da_users(status);
CREATE INDEX IF NOT EXISTS idx_da_users_total_collected_data ON da_users(total_collected_data);

-- Composite indexes for common query patterns
CREATE INDEX IF NOT EXISTS idx_da_users_manager_region ON da_users(reporting_manager_mobile, region);
CREATE INDEX IF NOT EXISTS idx_da_users_manager_zone ON da_users(reporting_manager_mobile, zone);
CREATE INDEX IF NOT EXISTS idx_da_users_manager_woreda ON da_users(reporting_manager_mobile, woreda);

-- Index for status filtering
CREATE INDEX IF NOT EXISTS idx_da_users_status_data ON da_users(status, total_collected_data);

-- Analyze tables to update statistics
ANALYZE woreda_reps;
ANALYZE da_users;

