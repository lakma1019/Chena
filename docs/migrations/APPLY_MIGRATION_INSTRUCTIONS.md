# How to Apply Database Migration

## Problem
The database changes for `special_notes` and updated delivery statuses are not visible in the UI because the migration hasn't been applied to your database yet.

## What the Migration Does
The migration adds:
1. **special_notes** column to the `deliveries` table (for transport provider notes)
2. **in_progress** and **delivered** status values to the delivery_status enum
3. An index on `assigned_date` for better performance

## How to Apply the Migration

### Option 1: Using MySQL Workbench (Recommended)
1. Open **MySQL Workbench**
2. Connect to your database (localhost, user: root, password: root)
3. Open the file: `database/migrations/add_delivery_notes_safe.sql`
4. Click the **Execute** button (lightning bolt icon) or press `Ctrl+Shift+Enter`
5. You should see success messages confirming the migration

### Option 2: Using Command Line (if MySQL is in PATH)
```bash
# Navigate to the project directory
cd "d:\BIT -Moratuwa\Chena"

# Run the migration
mysql -u root -proot Chena < database/migrations/add_delivery_notes_safe.sql
```

### Option 3: Using phpMyAdmin
1. Open **phpMyAdmin** in your browser (usually http://localhost/phpmyadmin)
2. Select the **Chena** database from the left sidebar
3. Click on the **SQL** tab
4. Copy and paste the contents of `database/migrations/add_delivery_notes_safe.sql`
5. Click **Go** to execute

### Option 4: Manual SQL Execution
If you have any MySQL client, run these SQL commands:

```sql
USE Chena;

-- Add special_notes column
ALTER TABLE deliveries
ADD COLUMN special_notes TEXT NULL AFTER delivery_status;

-- Add index for better performance
ALTER TABLE deliveries
ADD INDEX idx_assigned_date (assigned_date);

-- Update delivery_status enum
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
```

## Verify the Migration
After applying the migration, you can verify it worked by running:

```sql
USE Chena;
DESCRIBE deliveries;
```

You should see:
- A `special_notes` column of type TEXT
- The `delivery_status` column should include 'in_progress' and 'delivered' in its ENUM values

## After Migration
1. Restart your backend server (if it's running)
2. Refresh your browser
3. The special notes and new delivery statuses should now be visible in the UI

## Troubleshooting
- If you get "Column already exists" errors, that's okay - it means the migration was already partially applied
- If you get permission errors, make sure you're connected as the root user
- If the migration file doesn't run, try the manual SQL commands instead

