# Farm Size Unit Implementation

## Overview
This document describes the implementation of separate farm size value and unit fields in the Chena database.

## Database Changes

### Previous Structure
```sql
farm_size VARCHAR(50)  -- Stored as "5 Acres" or "120 Perch"
```

### New Structure
```sql
farm_size DECIMAL(10, 2)                    -- Numeric value: 5.00, 120.00
farm_size_unit ENUM('Acre', 'Perch')        -- Unit: 'Acre' or 'Perch'
```

## Benefits
1. **Better Data Validation**: Ensures only valid units (Acre/Perch) are stored
2. **Easier Querying**: Can filter/sort by farm size numerically
3. **Data Integrity**: Separates concerns - number vs unit
4. **Calculations**: Easier to perform calculations and conversions

## Migration Steps

### For New Installations
Simply run the updated schema:
```bash
mysql -u root -p < database/chena_schema.sql
```

### For Existing Databases
Run the migration script:
```bash
mysql -u root -p < database/migrations/add_farm_size_unit.sql
```

This will:
1. Add new columns `farm_size` (DECIMAL) and `farm_size_unit` (ENUM)
2. Migrate existing data from old VARCHAR field
3. Remove the old field
4. Preserve all existing data

## Frontend Changes

### Signup Form (`frontend/src/components/SignIn.jsx`)
- Added separate input for farm size (numeric)
- Added dropdown for unit selection (Acre/Perch)
- Default unit: Acre

### Profile Page (`frontend/src/components/farmer-profile/ProfileTab.jsx`)
- Displays farm size with unit (e.g., "120 Acre")
- Edit mode shows combined value

### Data Submission
Frontend sends combined string:
```javascript
farmSize: `${signUpData.farmSize} ${signUpData.farmSizeUnit}`
// Example: "120 Acre"
```

## Backend Changes

### Signup (`backend/src/controllers/authController.js`)
Parses the combined string and stores separately:
```javascript
// Input: "120 Acre"
// Stored as:
// farm_size: 120.00
// farm_size_unit: 'Acre'
```

### Login & Get Profile
Combines fields for frontend compatibility:
```javascript
// Database: farm_size=120.00, farm_size_unit='Acre'
// Returned: farm_size="120 Acre"
```

## API Contract

### Signup Request
```json
{
  "farmSize": "120 Acre",
  "farmName": "Green Valley Farm",
  "farmType": "Organic Vegetables"
}
```

### Login/Profile Response
```json
{
  "farm_size": "120 Acre",
  "farm_name": "Green Valley Farm",
  "farm_type": "Organic Vegetables"
}
```

## Supported Units
- **Acre**: Standard unit for larger farms
- **Perch**: Traditional Sri Lankan unit (1 Acre = 160 Perch)

## Example Data

### Sample Farmer 1
```sql
farm_size: 5.00
farm_size_unit: 'Acre'
-- Displayed as: "5 Acre"
```

### Sample Farmer 2
```sql
farm_size: 120.00
farm_size_unit: 'Perch'
-- Displayed as: "120 Perch"
```

## Rollback Instructions
If you need to rollback the migration, see the rollback script in:
`database/migrations/add_farm_size_unit.sql`

## Testing Checklist
- [ ] New farmer signup with Acre unit
- [ ] New farmer signup with Perch unit
- [ ] Farmer login displays correct farm size
- [ ] Profile page shows farm size correctly
- [ ] Profile edit maintains farm size value
- [ ] Migration script on existing database
- [ ] API returns correct format

## Files Modified
1. `database/chena_schema.sql` - Updated schema
2. `database/migrations/add_farm_size_unit.sql` - Migration script
3. `backend/src/controllers/authController.js` - Parse and combine logic
4. `frontend/src/components/SignIn.jsx` - Signup form with dropdowns
5. `frontend/src/components/farmer-profile/ProfileTab.jsx` - Profile display
6. `frontend/src/data/sriLankanBanks.js` - Added farmSizeUnits array

## Notes
- Default unit is 'Acre' if not specified
- Frontend always sends combined string format
- Backend handles parsing and storage
- API maintains backward compatibility

