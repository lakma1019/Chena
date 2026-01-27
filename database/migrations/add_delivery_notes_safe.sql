-- ============================================
-- ADD SPECIAL NOTES TO DELIVERIES TABLE (SAFE VERSION)
-- Migration to support transport provider notes
-- This version checks if changes already exist before applying them
-- ============================================

USE Chena;

-- Add special_notes column to deliveries table (only if it doesn't exist)
SET @dbname = 'Chena';
SET @tablename = 'deliveries';
SET @columnname = 'special_notes';
SET @preparedStatement = (SELECT IF(
  (
    SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
    WHERE
      (table_name = @tablename)
      AND (table_schema = @dbname)
      AND (column_name = @columnname)
  ) > 0,
  'SELECT ''Column special_notes already exists'' AS message;',
  'ALTER TABLE deliveries ADD COLUMN special_notes TEXT NULL AFTER delivery_status;'
));
PREPARE alterIfNotExists FROM @preparedStatement;
EXECUTE alterIfNotExists;
DEALLOCATE PREPARE alterIfNotExists;

-- Add index for better query performance (only if it doesn't exist)
SET @indexname = 'idx_assigned_date';
SET @preparedStatement = (SELECT IF(
  (
    SELECT COUNT(*) FROM INFORMATION_SCHEMA.STATISTICS
    WHERE
      (table_name = @tablename)
      AND (table_schema = @dbname)
      AND (index_name = @indexname)
  ) > 0,
  'SELECT ''Index idx_assigned_date already exists'' AS message;',
  'ALTER TABLE deliveries ADD INDEX idx_assigned_date (assigned_date);'
));
PREPARE alterIfNotExists FROM @preparedStatement;
EXECUTE alterIfNotExists;
DEALLOCATE PREPARE alterIfNotExists;

-- Update delivery_status enum to include new statuses
-- This will always run but won't cause errors
ALTER TABLE deliveries
MODIFY COLUMN delivery_status ENUM(
    'pending',
    'assigned',
    'picked_up',
    'in_progress',
    'in_transit',
    'delivered',
    'completed',
    'cancelled'
) DEFAULT 'pending';

-- Show success message
SELECT '✅ Migration completed successfully!' AS Status;
SELECT 'The deliveries table has been updated with:' AS Info;
SELECT '- special_notes column (for transport provider notes)' AS Changes;
SELECT '- idx_assigned_date index (for better performance)' AS Changes;
SELECT '- Updated delivery_status enum (added in_progress, delivered)' AS Changes;

