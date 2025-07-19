# PowerShell script to clean up merge conflict markers from migration files
Write-Host "Cleaning up merge conflict markers from migration files..."

# Get all .cs files in the Migrations directory
$migrationFiles = Get-ChildItem -Path "Migrations" -Filter "*.cs" -Recurse

foreach ($file in $migrationFiles) {
    Write-Host "Processing: $($file.Name)"
    
    # Read the file content
    $content = Get-Content -Path $file.FullName -Raw
    
    # Check if file contains merge conflict markers
    if ($content -match "<<<<<<<<") {
        Write-Host "  Found merge conflicts in $($file.Name)"
        
        # Remove merge conflict markers and keep the HEAD version
        $cleanedContent = $content -replace "<<<<<<<< HEAD:.*?========\s*\n.*?>>>>>>>> origin/.*?\n", ""
        
        # Also remove any remaining conflict markers
        $cleanedContent = $cleanedContent -replace "<<<<<<<<.*?========\s*\n.*?>>>>>>>>.*?\n", ""
        
        # Write the cleaned content back to the file
        Set-Content -Path $file.FullName -Value $cleanedContent -NoNewline
        
        Write-Host "  Cleaned $($file.Name)"
    }
}

Write-Host "Migration cleanup completed!" 