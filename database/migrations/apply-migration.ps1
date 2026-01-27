# PowerShell script to apply database migration
# This script applies the delivery notes migration to the Chena database

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Chena Database Migration Tool" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# MySQL configuration
$mysqlPath = "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe"
$dbUser = "root"
$dbName = "Chena"
$migrationFile = "add_delivery_notes_safe.sql"

# Check if MySQL exists
if (-not (Test-Path $mysqlPath)) {
    Write-Host "❌ MySQL not found at: $mysqlPath" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please check your MySQL installation or update the path in this script." -ForegroundColor Yellow
    Write-Host "Common paths:" -ForegroundColor Yellow
    Write-Host "  - C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" -ForegroundColor Yellow
    Write-Host "  - C:\xampp\mysql\bin\mysql.exe" -ForegroundColor Yellow
    Write-Host ""
    Read-Host "Press Enter to exit"
    exit 1
}

# Check if migration file exists
if (-not (Test-Path $migrationFile)) {
    Write-Host "❌ Migration file not found: $migrationFile" -ForegroundColor Red
    Write-Host "Make sure you're running this script from the database/migrations directory" -ForegroundColor Yellow
    Write-Host ""
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host "✓ MySQL found: $mysqlPath" -ForegroundColor Green
Write-Host "✓ Migration file found: $migrationFile" -ForegroundColor Green
Write-Host ""

# Prompt for password
Write-Host "Please enter your MySQL root password:" -ForegroundColor Yellow
$password = Read-Host -AsSecureString
$passwordPlain = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($password))

Write-Host ""
Write-Host "Applying migration..." -ForegroundColor Cyan

# Apply migration
try {
    $process = Start-Process -FilePath $mysqlPath `
        -ArgumentList "-u", $dbUser, "-p$passwordPlain", $dbName, "-e", "source $migrationFile" `
        -NoNewWindow -Wait -PassThru -RedirectStandardOutput "migration-output.txt" -RedirectStandardError "migration-error.txt"
    
    if ($process.ExitCode -eq 0) {
        Write-Host ""
        Write-Host "✅ Migration applied successfully!" -ForegroundColor Green
        Write-Host ""
        Write-Host "Changes applied:" -ForegroundColor Cyan
        Write-Host "  ✓ Added 'special_notes' column to deliveries table" -ForegroundColor Green
        Write-Host "  ✓ Added 'in_progress' and 'delivered' status values" -ForegroundColor Green
        Write-Host "  ✓ Added index on 'assigned_date' for better performance" -ForegroundColor Green
        Write-Host ""
        Write-Host "Next steps:" -ForegroundColor Yellow
        Write-Host "  1. Restart your backend server (if running)" -ForegroundColor White
        Write-Host "  2. Refresh your browser" -ForegroundColor White
        Write-Host "  3. The special notes should now be visible in the UI" -ForegroundColor White
        
        # Show output if any
        if (Test-Path "migration-output.txt") {
            $output = Get-Content "migration-output.txt"
            if ($output) {
                Write-Host ""
                Write-Host "Migration output:" -ForegroundColor Cyan
                Write-Host $output -ForegroundColor Gray
            }
            Remove-Item "migration-output.txt"
        }
    } else {
        Write-Host ""
        Write-Host "❌ Migration failed!" -ForegroundColor Red
        
        if (Test-Path "migration-error.txt") {
            $error = Get-Content "migration-error.txt"
            if ($error) {
                Write-Host ""
                Write-Host "Error details:" -ForegroundColor Red
                Write-Host $error -ForegroundColor Red
            }
            Remove-Item "migration-error.txt"
        }
    }
} catch {
    Write-Host ""
    Write-Host "❌ Error running migration: $_" -ForegroundColor Red
}

# Cleanup
if (Test-Path "migration-error.txt") {
    Remove-Item "migration-error.txt"
}

Write-Host ""
Read-Host "Press Enter to exit"

