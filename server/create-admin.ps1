$headers = @{
    'apikey' = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind4a2V2aGh5c2F3YmZ1b2JueWRvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDAyMzA2OCwiZXhwIjoyMDg5NTk5MDY4fQ.NsP0NIaWzahKc9ud4thUqc4QcqmpH0nh7VmImseaHA4'
    'Authorization' = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind4a2V2aGh5c2F3YmZ1b2JueWRvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDAyMzA2OCwiZXhwIjoyMDg5NTk5MDY4fQ.NsP0NIaWzahKc9ud4thUqc4QcqmpH0nh7VmImseaHA4'
    'Content-Type' = 'application/json'
    'Prefer' = 'return=representation'
}

# Check existing users
Write-Host "=== CHECKING EXISTING USERS ==="
try {
    $users = Invoke-RestMethod -Uri 'https://wxkevhhysawbfuobnydo.supabase.co/rest/v1/wb_users?select=id,email,role,name' -Method GET -Headers $headers
    $users | ConvertTo-Json -Depth 5
} catch {
    Write-Host "Error checking users: " + $_.Exception.Message
}

# Register admin user via Railway backend
Write-Host "`n=== REGISTERING ADMIN ==="
$body = '{"name":"WinBig Admin","email":"admin@winbigafrica.com","password":"Admin@2026"}'
try {
    $resp = Invoke-RestMethod -Uri 'https://backend-production-9aa6.up.railway.app/api/auth/register' -Method POST -Headers @{'Content-Type'='application/json'} -Body $body
    Write-Host "Registered:"
    $resp | ConvertTo-Json -Depth 5
} catch {
    Write-Host "Register error: " + $_.Exception.Message
}

Start-Sleep -Seconds 2

# Now update role to admin via Supabase REST
Write-Host "`n=== UPDATING ROLE TO ADMIN ==="
$patchBody = '[{"op":"replace","path":"/role","value":"admin"}]'
try {
    $updated = Invoke-RestMethod -Uri 'https://wxkevhhysawbfuobnydo.supabase.co/rest/v1/wb_users?email=eq.admin%40winbigafrica.com' -Method PATCH -Headers $headers -Body $patchBody
    $updated | ConvertTo-Json -Depth 5
    Write-Host "Role updated!"
} catch {
    Write-Host "Patch error: " + $_.Exception.Message
}

# Verify
Start-Sleep -Seconds 1
Write-Host "`n=== VERIFYING ==="
try {
    $users = Invoke-RestMethod -Uri 'https://wxkevhhysawbfuobnydo.supabase.co/rest/v1/wb_users?email=eq.admin%40winbigafrica.com&select=id,email,role,name' -Method GET -Headers $headers
    $users | ConvertTo-Json -Depth 5
} catch {
    Write-Host "Verify error: " + $_.Exception.Message
}
