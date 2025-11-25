-- Migration script to add status column to da_users table if it doesn't exist
-- Run this script if the status column is missing from your da_users table

-- Check if status column exists, if not add it
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'da_users' 
        AND column_name = 'status'
    ) THEN
        ALTER TABLE da_users ADD COLUMN status VARCHAR(50) DEFAULT 'Active';
        UPDATE da_users SET status = 'Active' WHERE status IS NULL;
    END IF;
END $$;

-- Optional: Add index for better query performance
CREATE INDEX IF NOT EXISTS idx_da_users_reporting_manager_mobile ON da_users(reporting_manager_mobile);
CREATE INDEX IF NOT EXISTS idx_da_users_region ON da_users(region);
CREATE INDEX IF NOT EXISTS idx_da_users_zone ON da_users(zone);
CREATE INDEX IF NOT EXISTS idx_da_users_woreda ON da_users(woreda);

