@echo off
echo ============================================
echo Running Database Migration
echo ============================================
echo.
echo This will add the special_notes column and update delivery_status enum
echo.
pause

mysql -u root -p Chena < migrations/add_delivery_notes.sql

echo.
echo ============================================
echo Migration Complete!
echo ============================================
pause

