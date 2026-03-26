$headers = @{
    "Authorization" = "Bearer Z7LQmWXpMHVYCFIblxJouy9D"
    "Content-Type" = "application/json"
}

# Try v6 endpoint first
try {
    $response = Invoke-RestMethod -Uri "https://api.vercel.com/v6/projects" -Method Get -Headers $headers
    $response.projects | ConvertTo-Json -Depth 3
} catch {
    Write-Host "v6 error: $($_.Exception.Message)"
}

# Try v10 endpoint
try {
    $response2 = Invoke-RestMethod -Uri "https://api.vercel.com/v10/projects/WinBig-AFRICA" -Method Get -Headers $headers
    $response2 | ConvertTo-Json -Depth 3
} catch {
    Write-Host "v10 project error: $($_.Exception.Message)"
}
