-- ============================================
-- MIGRATION: Add farm_size_unit to farmers table
-- Date: 2024-12-15
-- Description: Splits farm_size into numeric value and unit (Acre/Perch)
-- ============================================

USE Chena;

-- Step 1: Add new columns
ALTER TABLE farmers
ADD COLUMN farm_size_new DECIMAL(10, 2) COMMENT 'Numeric value of farm size' AFTER farm_size,
ADD COLUMN farm_size_unit ENUM('Acre', 'Perch') DEFAULT 'Acre' COMMENT 'Unit of measurement for farm size' AFTER farm_size_new;

-- Step 2: Migrate existing data
-- Extract numeric value and unit from existing farm_size field
-- Assumes format like "5 Acres", "120 Perch", etc.

UPDATE farmers
SET 
    farm_size_new = CAST(REGEXP_REPLACE(farm_size, '[^0-9.]', '') AS DECIMAL(10, 2)),
    farm_size_unit = CASE 
        WHEN farm_size LIKE '%Perch%' OR farm_size LIKE '%perch%' THEN 'Perch'
        ELSE 'Acre'
    END
WHERE farm_size IS NOT NULL AND farm_size != '';

-- Step 3: Drop old farm_size column
ALTER TABLE farmers DROP COLUMN farm_size;

-- Step 4: Rename new column to farm_size
ALTER TABLE farmers CHANGE COLUMN farm_size_new farm_size DECIMAL(10, 2) COMMENT 'Numeric value of farm size';

-- Step 5: Verify the migration
SELECT 
    farmer_id,
    farm_name,
    farm_size,
    farm_size_unit,
    CONCAT(farm_size, ' ', farm_size_unit) AS display_farm_size
FROM farmers;

-- ============================================
-- ROLLBACK SCRIPT (if needed)
-- ============================================
-- To rollback this migration, run:
-- 
-- ALTER TABLE farmers
-- ADD COLUMN farm_size_old VARCHAR(50) AFTER farm_size_unit;
-- 
-- UPDATE farmers
-- SET farm_size_old = CONCAT(farm_size, ' ', farm_size_unit)
-- WHERE farm_size IS NOT NULL;
-- 
-- ALTER TABLE farmers 
-- DROP COLUMN farm_size,
-- DROP COLUMN farm_size_unit;
-- 
-- ALTER TABLE farmers 
-- CHANGE COLUMN farm_size_old farm_size VARCHAR(50);
-- ============================================

