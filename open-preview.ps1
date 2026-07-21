$node = "C:\Users\seigo\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe"
$project = "C:\Users\seigo\Documents\Codex\2026-07-09\new-chat\outputs\care-hair-next"

Set-Location $project
Write-Host "Care Hair preview is starting..."
Write-Host "Open this URL in your browser: http://localhost:3000"
Write-Host "Keep this window open while checking the site."
& $node "$project\preview-server.js"
