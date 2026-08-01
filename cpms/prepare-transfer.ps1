$source = $PSScriptRoot
$desktop = [Environment]::GetFolderPath("Desktop")
$tempDest = Join-Path -Path $desktop -ChildPath "cpms-export-temp"
$zipPath = Join-Path -Path $desktop -ChildPath "cpms-project.zip"

Write-Host "Copying project files to temporary directory (excluding heavy folders like node_modules)..."
# /MIR mirrors the directory tree
# /XD excludes directories
# /XF excludes files (none for now)
robocopy $source $tempDest /MIR /XD "node_modules" ".next" ".expo" ".turbo" "dist" "build" ".git"

Write-Host ""
Write-Host "Compressing project into a zip file at: $zipPath"
if (Test-Path $zipPath) { Remove-Item $zipPath }
Compress-Archive -Path "$tempDest\*" -DestinationPath $zipPath

Write-Host "Cleaning up temporary files..."
Remove-Item -Recurse -Force $tempDest

Write-Host ""
Write-Host "======================================================="
Write-Host "SUCCESS: Your project is ready to be transferred!"
Write-Host "Please take the file at: $zipPath"
Write-Host "======================================================="
Write-Host "You can share this zip file. See SETUP_INSTRUCTIONS.md inside for how to run it on your new laptop."
