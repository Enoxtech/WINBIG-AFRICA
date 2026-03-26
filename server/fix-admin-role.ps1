$headers = @{
    'apikey' = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind4a2V2aGh5c2F3YmZ1b2JueWRvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDAyMzA2OCwiZXhwIjoyMDg5NTk5MDY4fQ.NsP0NIaWzahKc9ud4thUqc4QcqmpH0nh7VmImseaHA4'
    'Authorization' = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind4a2V2aGh5c2F3YmZ1b2JueWRvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDAyMzA2OCwiZXhwIjoyMDg5NTk5MDY4fQ.NsP0NIaWzahKc9ud4thUqc4QcqmpH0nh7VmImseaHA4'
    'Content-Type' = 'application/json'
}

# Direct UPDATE to set role=admin
Write-Host "=== UPDATING ROLE TO ADMIN ==="
$body = '{"role":"admin"}'
try {
    $updated = Invoke-RestMethod -Uri 'https://wxkevhhysawbfuobnydo.supabase.co/rest/v1/wb_users?email=eq.admin%40winbigafrica.com' -Method PATCH -Headers $headers -Body $body
    $updated | ConvertTo-Json -Depth 5
    Write-Host "Updated: $(($updated | ConvertTo-Json -Depth 5))"
} catch {
    Write-Host "Error: " + $_.Exception.Message
    Write-Host "Response: " + $_.Exception.Response.StatusCode
}

Start-Sleep -Seconds 2

# Verify
Write-Host "`n=== VERIFYING ==="
try {
    $users = Invoke-RestMethod -Uri 'https://wxkevhhysawbfuobnydo.supabase.co/rest/v1/wb_users?email=eq.admin%40winbigafrica.com&select=id,email,role,name' -Method GET -Headers $headers
    $users | ConvertTo-Json -Depth 5
} catch {
    Write-Host "Verify error: " + $_.Exception.Message
}
