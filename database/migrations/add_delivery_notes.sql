USE Chena;

-- Add special_notes column to deliveries table
ALTER TABLE deliveries
ADD COLUMN special_notes TEXT NULL AFTER delivery_status;

-- Add index for better query performance
ALTER TABLE deliveries
ADD INDEX idx_assigned_date (assigned_date);

-- Update delivery_status enum to include 'in_progress' (if not already present)
-- Note: MySQL doesn't support direct ENUM modification, so we need to alter the column
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

