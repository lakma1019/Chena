@echo off
REM Batch script to apply database migration
REM This script applies the delivery notes migration to the Chena database

echo ========================================
echo Chena Database Migration Tool
echo ========================================
echo.

set MYSQL_PATH="C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe"
set DB_USER=root
set DB_NAME=Chena
set MIGRATION_FILE=add_delivery_notes_safe.sql

REM Check if MySQL exists
if not exist %MYSQL_PATH% (
    echo ERROR: MySQL not found at: %MYSQL_PATH%
    echo.
    echo Please check your MySQL installation or update the path in this script.
    echo Common paths:
    echo   - C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe
    echo   - C:\xampp\mysql\bin\mysql.exe
    echo.
    pause
    exit /b 1
)

REM Check if migration file exists
if not exist %MIGRATION_FILE% (
    echo ERROR: Migration file not found: %MIGRATION_FILE%
    echo Make sure you're running this script from the database/migrations directory
    echo.
    pause
    exit /b 1
)

echo MySQL found: %MYSQL_PATH%
echo Migration file found: %MIGRATION_FILE%
echo.
echo Applying migration to database: %DB_NAME%
echo.
echo You will be prompted for your MySQL root password...
echo.

REM Apply migration
%MYSQL_PATH% -u %DB_USER% -p %DB_NAME% < %MIGRATION_FILE%

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo Migration applied successfully!
    echo ========================================
    echo.
    echo Changes applied:
    echo   - Added 'special_notes' column to deliveries table
    echo   - Added 'in_progress' and 'delivered' status values
    echo   - Added index on 'assigned_date' for better performance
    echo.
    echo Next steps:
    echo   1. Restart your backend server if running
    echo   2. Refresh your browser
    echo   3. The special notes should now be visible in the UI
    echo.
) else (
    echo.
    echo ========================================
    echo Migration failed!
    echo ========================================
    echo.
    echo Please check the error messages above.
    echo.
)

pause

